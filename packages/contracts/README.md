# Generated public contracts

The JavaScript and TypeScript declarations in `generated/` are bundled from the platform's API contracts and the schemas needed by SDK and docs. Zod remains an external dependency. Backend implementations and database source are not included. This workspace package is private to this repository; the SDK bundles the contracts into its distributable.

Regenerate through the platform export script rather than editing these files. The rest of the repository builds and tests without the platform checkout.
