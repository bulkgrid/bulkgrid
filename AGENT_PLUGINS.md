# Bulkgrid agent plugins

Bulkgrid plugins search accessible indexed sources and collections, read indexed documents, and cite returned source URLs.
They connect to `https://bulkgrid.com/api/v1/mcp`. They do not create sources or start refresh work.

The portable bundle lives in `plugins/bulkgrid/`. The Claude bundle lives in `plugins/bulkgrid-claude/`.
These are generated files. Edit shared metadata in `packages/agent-core/` and instructions in `skills/bulkgrid-search/SKILL.md`.
`bulkgrid-sources` remains a separate optional skill with explicit management permissions.

## Installation candidates

These paths are prepared for acceptance testing. No client version or operating system passed live acceptance during this migration.
Do not advertise verified support until a client acceptance record contains evidence for the tested version and operating system.

### ChatGPT and Codex

The portable package contains OpenAI listing metadata under `extensions.com.openai`.
The repository catalog uses `.agents/plugins/marketplace.json`.
Use the [documented local plugin flow](https://developers.openai.com/plugins/build/plugins) to install the bundle in a test profile.
The public directory entry remains pending. A catalog entry does not establish public directory approval.
Use the [OpenAI submission guide](https://developers.openai.com/plugins/deploy/submission) for the release ZIP and review process.

For a repository catalog, the documented CLI command is:

```sh
codex plugin marketplace add bulkgrid/bulkgrid
```

Use the desktop plugin browser to install and test the entry. Make sure that it loads `plugins/bulkgrid/`.
Follow the client's plugin controls for updates and removal. Record the exact steps for the tested version.

### Claude Code

The Claude catalog at `.claude-plugin/marketplace.json` points to the native bundle.
From a local checkout, use these [marketplace commands](https://code.claude.com/docs/en/plugin-marketplaces):

```sh
claude plugin validate ./plugins/bulkgrid-claude
claude plugin marketplace add .
claude plugin install bulkgrid@bulkgrid
claude plugin details bulkgrid
```

After the accepted catalog is published, replace the local marketplace source with `bulkgrid/bulkgrid`.
Use Claude's plugin manager for updates and uninstall. Make sure that an update loads the changed version.
Every released content change must increase the manifest version because Claude caches installed versions.

### Cursor

The catalog at `.cursor-plugin/marketplace.json` points to the portable bundle.
Cursor documents [portable support and its repository submission process](https://cursor.com/docs/reference/plugins).
Use Cursor's plugin interface with this repository in a clean profile.
Record the installed version, loaded MCP server, update steps, and uninstall steps before claiming support.
Submit the public repository through Cursor's publishing interface only after acceptance passes.

### Copilot in VS Code

The Claude catalog provides the repository marketplace candidate for VS Code.
VS Code documents [plugin marketplaces and installation controls](https://code.visualstudio.com/docs/agent-customization/agent-plugins).
Add `bulkgrid/bulkgrid` to `chat.plugins.marketplaces`, then find Bulkgrid in the Agent Plugins view.
Record the selected package, enabled skill, and connection before continuing with acceptance.
Use the plugin's update and uninstall controls in that view.

Copilot CLI and the Copilot app require separate acceptance records. A VS Code result does not establish their support.

## Authorization and the first search

Installation supplies instructions and the remote endpoint. Each client manages its own sign-in and credential storage.
Complete the client's authorization flow, choose the workspace, and review the allowed collections.
CLI browser login does not sign other clients in. An OAuth connection does not grant source-management permission.
Do not put credentials into manifests, ZIPs, examples, or chat messages.

For the first search, choose an indexed document that the connection can access.
Ask the agent to list accessible sources, search that document's source or collection, and cite returned URLs.
Ask it to read the indexed document when more context is necessary. Reading indexed content does not fetch the live page.

If you previously ran `bulkgrid init`, inspect the existing MCP entry before installing the plugin.
Choose one Bulkgrid connection, remove only the duplicate Bulkgrid entry, and preserve other client configuration.
Plugin uninstall and connection revocation are separate actions. Revoke access through the supported Bulkgrid account interface.
Make sure that the revoked connection can no longer retrieve content.

## License boundaries

Plugin resources and root skills use Apache-2.0. Bundled packages carry the license text and applicable notices.
Bulkgrid brand assets retain their stated asset notices. The license does not grant trademark rights.
SDK and CLI package licenses remain unchanged. The documentation license remains in `docs/LICENSE`.
