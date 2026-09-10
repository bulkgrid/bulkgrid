import { createHash, randomUUID } from 'node:crypto';
import { chmod, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { z } from 'zod';

export const credentialsSchema = z.object({
  origin: z.string().url(),
  issuer: z.string().url(),
  tokenEndpoint: z.string().url(),
  clientId: z.string().min(1),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.number().finite(),
});
export type CliCredentials = z.infer<typeof credentialsSchema>;

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}

export class AuthStorage {
  constructor(private readonly directory = join(homedir(), '.config', 'bulkgrid')) {}

  private path(origin: string): string {
    return join(this.directory, `${createHash('sha256').update(origin).digest('hex')}.json`);
  }

  async read(origin: string): Promise<CliCredentials | undefined> {
    try {
      const result = credentialsSchema.safeParse(JSON.parse(await readFile(this.path(origin), 'utf8')));
      if (!result.success || result.data.origin !== origin) {
        throw new Error('Invalid saved CLI credentials. Run bulkgrid logout --local to clear them.');
      }
      return result.data;
    } catch (error) {
      if (hasCode(error, 'ENOENT')) {
        return undefined;
      }
      if (error instanceof SyntaxError) {
        throw new Error('Invalid saved CLI credentials. Run bulkgrid logout --local to clear them.');
      }
      throw error;
    }
  }

  async save(credentials: CliCredentials): Promise<void> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    await chmod(this.directory, 0o700);
    const target = this.path(credentials.origin);
    const temporary = `${target}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, JSON.stringify(credentials), { mode: 0o600, flag: 'wx' });
      await rename(temporary, target);
    } finally {
      await unlink(temporary).catch(error => {
        if (!hasCode(error, 'ENOENT')) {
          throw error;
        }
      });
    }
  }

  async clear(origin: string): Promise<void> {
    await unlink(this.path(origin)).catch(error => {
      if (!hasCode(error, 'ENOENT')) {
        throw error;
      }
    });
  }

  // Hold one lock across refresh and persistence, including across CLI processes.
  async exclusive<T>(origin: string, operation: () => Promise<T>): Promise<T> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    const lock = `${this.path(origin)}.lock`;
    try {
      await writeFile(lock, String(process.pid), { flag: 'wx', mode: 0o600 });
    } catch (error) {
      if (hasCode(error, 'EEXIST')) {
        throw new Error(`Another CLI authentication operation is running. If it has stopped, remove ${lock} and retry.`);
      }
      throw error;
    }
    try {
      return await operation();
    } finally {
      await unlink(lock);
    }
  }
}
