class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // marks errors we threw on purpose
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;