const { PORT, NODE_ENV } = require("./config/env");
const app = require("./app");

// app.listen returns the HTTP server, which Socket.IO can attach to later
const server = app.listen(PORT, () => {
  console.log(`BloodLink backend running on port ${PORT} (${NODE_ENV})`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other server first.`);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// Hosting platforms send SIGTERM when restarting the app
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);
  server.close(() => process.exit(0));
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));