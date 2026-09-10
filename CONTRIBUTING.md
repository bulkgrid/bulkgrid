# Contributing

SDK, CLI, and documentation development currently lives in the private Bulkgrid platform workspace. Public changes must be incorporated there before the next export so they are preserved. Generated files under `packages/contracts/generated` and the OpenAPI documents must not be edited independently.

Run `npm ci` and `npm run check` to build and validate this checkout without the private platform. Tests mock service requests; they do not require production credentials. Examples call the hosted API only when explicitly run.
