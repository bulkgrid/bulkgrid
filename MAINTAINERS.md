# Maintaining the public export

From the private platform checkout, run:

```sh
node scripts/public-repo/export.mjs /absolute/path/to/new-staging-directory
```

The destination must not exist. The exporter copies an explicit set of SDK, CLI, and documentation inputs and bundles public API contracts. It never copies Git history or environment files. `export-manifest.json` records the source commit and hashes of working inputs, including uncommitted changes.

In the staging directory, run `npm install`, `npm run openapi:generate`, and `npm run check`. Review the resulting changes before applying them to this repository, preserving `.git` and incorporating public contributions into the platform first. Commit the lockfile with each dependency update. Exporting is scripted; publishing and scheduled synchronization are not enabled.

The hosted MCP endpoint, OAuth, database, crawling and search engines, billing, infrastructure, and internal runbooks remain in the private platform.

Before first publication, choose the Bulkgrid license and GitHub organization, and review the exported source snapshot. No remote or npm publishing workflow is configured here.
