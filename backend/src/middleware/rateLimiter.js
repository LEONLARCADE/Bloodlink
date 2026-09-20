const rateLimit = require("express-rate-limit");
const AppError = require("../utils/AppError");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError("Too many requests, please try again later", 429));
  },
});

// Tighter limit for login/register specifically, to slow down credential
// stuffing and brute-force attempts without affecting normal API traffic.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new AppError("Too many attempts. Please wait a few minutes and try again.", 429)
    );
  },
});

module.exports = { apiLimiter, authLimiter };