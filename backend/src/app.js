const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { clientUrls, isProduction } = require("./config/env");
const routes = require("./routes");
const AppError = require("./utils/AppError");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Behind a hosting proxy (Render, Railway) so rate limiting sees the real IP
if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header means curl, Postman or server-to-server calls
      if (!origin || clientUrls.includes(origin)) {
        return callback(null, true);
      }
      callback(new AppError("Origin not allowed by CORS", 403));
    },
    credentials: true,
  })
);

app.use("/api", apiLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;