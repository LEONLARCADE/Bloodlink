const dotenv = require("dotenv");

dotenv.config({ quiet: true });

const NODE_ENV = process.env.NODE_ENV || "development";
const isProduction = NODE_ENV === "production";

// Hosting platforms (Render, Railway) set PORT themselves.
const PORT = Number(process.env.PORT) || 5000;

// CLIENT_URL may be one URL or several separated by commas.
// The localhost fallback is for development only.
const rawClientUrl =
  process.env.CLIENT_URL || (isProduction ? "" : "http://localhost:5173");

const clientUrls = rawClientUrl
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

if (clientUrls.length === 0) {
  throw new Error("CLIENT_URL must be set in production (your frontend URL).");
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Set it in backend/.env");
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing. Set it in backend/.env");
}
if (isProduction && JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET is too short for production. Use at least 32 random characters."
  );
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// Keep this in sync with JWT_EXPIRES_IN above (used for the cookie's Max-Age).
const JWT_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "bloodlink_token";

module.exports = {
  NODE_ENV,
  isProduction,
  PORT,
  clientUrls,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_COOKIE_MAX_AGE_MS,
  AUTH_COOKIE_NAME,
};