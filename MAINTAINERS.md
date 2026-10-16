# Maintaining the public repository

This repository has two source boundaries. The private Bulkgrid platform owns the TypeScript and Python SDKs, CLI, API contract, and service documentation source. This public repository owns agent plugins, shared skills, repository tooling, tooling configuration, CI and release workflows, and public contribution instructions. Documentation content remains platform-owned. Documentation scripts are public-owned.

The private exporter creates a staging snapshot. It does not update this checkout. Never use the exporter with this repository as its destination.

## Apply a staged export

Run the exporter from the private platform checkout and use a new staging directory:

```sh
node scripts/public-repo/export.mjs /absolute/path/to/new-staging-directory
```

In the staging directory, install dependencies, regenerate OpenAPI files, and run the checks:

```sh
npm install
npm run openapi:generate
npm run check
```

From this public checkout, preview the overlay and inspect its file list and any root script conflicts:

```sh
npm run export:apply -- --preview /absolute/path/to/staging-directory
```

The preview is read-only. It lists additions and replacements, names public values that will win root `package.json` collisions, and identifies the protected paths. Resolve any collision that would drop needed SDK or CLI behavior before applying. Then apply the reviewed snapshot:

```sh
npm run export:apply -- --apply /absolute/path/to/staging-directory
npm install
npm run openapi:generate
npm run check
```

The apply tool overlays only SDK, CLI, contracts, API documentation, examples, OpenAPI, and the export provenance record. If present in the staging export, it includes `packages/sdk-python` and `.github/workflows/check-python-sdk.yml`. It does not copy package publishing workflows or delete files. It preserves the public README, `MAINTAINERS.md`, `CONTRIBUTING.md`, shared skills, plugin packages, agent workspaces, marketplace files, `scripts/**`, `docs/scripts/**`, tooling configuration, and public CI/release workflows. It also keeps the current public root scripts on key conflicts, imports non-conflicting exported script keys that do not reference retired JavaScript tooling paths, and retains public workspace and dependency entries. Review the root manifest merge in the preview. The overlay rejects imported commands that reference retired tooling paths. It ignores old staged scripts and documentation tooling. The staged lockfile is never copied; regenerate the public lockfile with `npm install` after applying.

The helper rejects symlinks in copied source and destination paths. Keep the staging export outside this checkout. Review `git diff` after applying and commit the resulting `package-lock.json` with package dependency changes.

## Ownership and generation

Author plugin resources and shared skills in this public repository. Keep `skills/bulkgrid-search` as the shared retrieval source and keep source-management guidance in the separate `skills/bulkgrid-sources` skill. Generate installable plugin copies from their public source with the plugin scripts; do not edit generated copies directly.

The private platform remains the source for SDKs, CLI, contracts, and service documentation. OpenAPI and contract output is generated from the platform schemas. Do not edit `packages/contracts/generated` or synchronized OpenAPI output independently.

The hosted MCP service, OAuth, database, crawling and search engines, billing, infrastructure, and internal runbooks remain in the private platform.
