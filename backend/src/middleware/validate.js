const AppError = require("../utils/AppError");

// Wraps a Zod schema as Express middleware. On failure, responds 400 with
// a field -> message map; on success, replaces req.body with the parsed
// (and coerced/trimmed) data so controllers can trust its shape.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const details = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!details[key]) details[key] = issue.message;
    }
    return next(new AppError("Validation failed", 400, details));
  }

  req.body = result.data;
  next();
};

module.exports = validate;