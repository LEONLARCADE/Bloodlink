const AppError = require("../utils/AppError");

// Use after `protect`. Rejects with 403 if req.user's role isn't allowed.
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new AppError("You must be logged in to do that", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to do that", 403));
    }
    next();
  };

module.exports = { requireRole };