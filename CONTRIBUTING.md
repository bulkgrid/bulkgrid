# Contributing

This public repository is the source for the Bulkgrid agent plugins, shared skills, repository tooling, tooling configuration, CI and release workflows, and their documentation. Make those changes here. The generated portable and client-specific plugin directories are outputs; edit their source files and rebuild them instead.

The private platform checkout remains the source for the TypeScript SDK, CLI, API contracts, and service documentation content. Documentation scripts are maintained here. To review and apply one of its snapshots, follow [MAINTAINERS.md](MAINTAINERS.md). The public apply tool keeps plugin, skill, and tooling work intact, merges root scripts, and leaves the public lockfile for regeneration in this checkout.

Generated files under `packages/contracts/generated` and synchronized OpenAPI documents follow the platform schemas. Update the source contract and regenerate these outputs instead of editing them independently.

Run the public checks with Node.js 22 or newer:

```bash
npm ci
npm run check
```

Repository tools use strict TypeScript. Run them through the npm scripts, which use the development dependency `tsx`. `npm run check:types` checks both tooling and workspace types. Vitest runs package and tooling tests sequentially. Python 3.9 or newer remains required for plugin ZIP tests.

The tests mock service requests and do not require production credentials. Examples call the hosted API only when explicitly run.

## Python SDK

When `packages/sdk-python` is present, use Python 3.10+ and install `pip install -e 'packages/sdk-python[dev]'`. Run the tests and checks listed in [the SDK README](packages/sdk-python/README.md). Generated types and methods follow the public OpenAPI contract; update the platform contract and regenerate instead of editing generated Python files. Its optional CI check is exported with the SDK. Package publication remains a separate release decision.
