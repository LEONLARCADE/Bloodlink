const { isProduction } = require("../config/env");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Something went wrong on the server";
  let details;

  if (err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON in request body";
  } else if (err.type === "entity.too.large") {
    statusCode = 413;
    message = "Request body is too large";
  }

  // Unexpected errors are logged on the server only
  if (statusCode >= 500) {
    console.error(err);
  }

  const body = { success: false, message };
  if (details) body.errors = details;
  if (!isProduction && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
};

module.exports = errorHandler;