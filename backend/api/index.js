// Vercel serverless entrypoint.
//
// Vercel's Node.js runtime accepts an Express app exported directly — an
// Express app is itself a valid (req, res) request handler, so no adapter
// library or rewrite of the app is needed. This just re-exports the same
// `app` that src/server.js already uses for local dev (server.js additionally
// calls app.listen(), which only makes sense for a long-running process, so
// it stays local-dev-only and is untouched).
module.exports = require("../src/app");