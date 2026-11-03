# Prepare a Bulkgrid plugin release

Plugin releases use independent semantic versions and `plugin-v<version>` tags. SDK and CLI releases keep their existing identities.
Version `0.1.1` identifies the migration baseline. It does not establish that the version is available for publication.
Version `0.2.0` is the prepared capability expansion for Claude and ChatGPT: optional Crawl, Map, Extract, and index management. It is not a claim of deployment, publication, or completed client acceptance.
Before release, a named operator must make sure that the version does not conflict with an existing submission or published artifact.

## Build and inspect

Use Node.js 22 or newer, the committed npm lockfile, and Python 3.9 or newer for archive tooling.
The npm commands run TypeScript tooling through `tsx` and check its types separately.
From a clean public checkout, run:

```sh
npm ci
npm run plugins:check
npm run check
npm run plugins:archive
```

`plugins:check` rejects differences between sources and committed output before the build can overwrite them.
For an intended source change, run `npm run plugins:build`, inspect the output, and commit both sources and generated files.
Keep ZIPs in `dist/plugins/` as release artifacts. They are not authoring sources.

Review the archives, inventories, SHA-256 digests, and release record together.
Make sure that every package contains only the shared `bulkgrid-search` skill (including approved web and index workflows), public metadata, required configuration, assets and license files. The standalone `bulkgrid-sources` skill is not bundled.
Make sure that the recorded version agrees with each manifest and archive filename.
Run the tests against extracted archives, rather than relying only on workspace inspection.
Local dirty inputs cannot establish an accepted release commit. Commit the reviewed changes before tagging.

## Manual draft workflow

The workflow `.github/workflows/plugin-release.yml` accepts an existing `plugin-v<version>` tag.
It checks the tag version, runs repository checks, and builds artifacts with source read access.
A separate job receives release write access and attaches the files to a new draft release.
Pull-request checks receive no publisher credentials. The workflow does not publish the draft or submit marketplace updates.

Before running the workflow, complete these steps:

1. Name the authorized release operator and account operators.
2. Make sure that repository permissions and tag protection match the accepted release policy.
3. Make sure that the reviewed source commit is clean and that the selected version is available.
4. Complete client acceptance for every advertised surface and keep a record of the results.
5. Review applicable asset notices and public policy information.
6. Create the version tag at the reviewed commit without moving an existing tag.
7. Run Prepare plugin release with that tag.
8. Inspect the completed draft, its source commit, and every asset digest.

A human release operator publishes the completed draft after acceptance. This remains an external step.
If immutable releases are enabled, attach every file before publication.
Never move a published tag or replace an immutable asset. Corrected content requires a new version.

## Directory submissions

### Capability acceptance for 0.2.0

Deploy the corresponding MCP service and optional consent flow before testing or advertising the new capabilities. Updating a package alone cannot enable the server tools. Record the deployed service version alongside each tested app version and operating system.

For both Claude and ChatGPT, test:

- Existing and newly approved retrieval-only connections still expose retrieval tools without web or index management access.
- Revoke the old grant through Settings → Connected Apps, reconnect, and verify that both optional capability choices start unchecked.
- With **Crawl, map and extract**, start bounded test runs, check progress, paginate results, and read collected content and extraction fields. Verify Map returns URLs rather than page content.
- With **Manage the index**, add or reuse an approved test source, check indexing, create a collection, and update membership within the grant's collection boundaries. Verify the accompanying Crawl and Map access described during consent.
- Denied scopes, inaccessible collections, and API quota errors remain errors; uncertain mutations are not automatically repeated.
- Monitoring tools remain unavailable through OAuth, and revoking the connection removes its access.

Use disposable fixtures and an explicit credit budget. Track pending results honestly; package validation and unit tests do not establish live client acceptance.

### Submission channels

The public repository owns plugin contributions. The hosted MCP service follows the separate private platform release process.
Complete account readiness and review evidence before submitting a plugin.
Keep private review users, account identifiers and submission notes outside this repository.

| Channel | Prepared input | External requirement |
| --- | --- | --- |
| OpenAI directory | Portable ZIP and listing metadata | Authorized organization, policy and demonstration material, MCP review, approval |
| Claude marketplace | Native bundle and `.claude-plugin/marketplace.json` | Clean install and update evidence, accepted catalog commit, directory submission if selected |
| Cursor marketplace | Portable bundle and `.cursor-plugin/marketplace.json` | Public repository submission and review |
| Copilot in VS Code | Repository marketplace candidate | Tested VS Code surface, marketplace discovery evidence |
| Other Copilot surfaces | Pending testing | Record the supported install and listing path separately |

Do not treat a draft GitHub release as a submitted or approved directory listing.
Record each channel's submitted version, approved version, artifact or commit, and outcome separately.
Publish a catalog pointer only after its target files exist and the corresponding installation case passes.
Current repository catalogs are development candidates that refer to committed output paths. A catalog is not a public listing approval.

## Recovery

If a job fails, retain successful artifacts and their digests. Read the logs before retrying.
If draft creation partially succeeds, inspect the draft before another upload. Do not overwrite assets blindly.
Compare each existing draft asset against the accepted digest. Attach only missing files with identical accepted content.
If contents change, create a new version and repeat the affected acceptance cases.

If a channel fails after another channel succeeds, record both outcomes separately.
Retry the failed channel with the same accepted artifact when its host permits that action.
For a broken catalog pointer, restore the previous accepted target when the host permits it.
Keep the previous tested release available. Backend failures use the private platform recovery process.

Release logs and artifact digests provide build feedback. Client records provide consent, retrieval, web-operation, and index-management feedback.
Do not add query or passage logging for this migration. Name a support operator before publication.
Account setup, npm publisher migration, live tests, directory submissions and publication remain pending.
