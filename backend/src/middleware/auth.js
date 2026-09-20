const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");
const { AUTH_COOKIE_NAME } = require("../config/env");

// Fields safe to attach to req.user / send to the frontend.
// Never includes passwordHash. The profile relations are only fetched as an
// existence check (id only) so we can compute `hasProfile` without leaking
// profile data through the auth endpoints.
const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
  donorProfile: { select: { id: true } },
  recipientProfile: { select: { id: true } },
};

// Collapses the donorProfile/recipientProfile existence-check relations into
// a single `hasProfile` boolean the frontend uses to decide whether to route
// a user to onboarding or straight to their dashboard. ADMIN accounts have
// no profile concept, so they're always considered "complete".
const withProfileStatus = (user) => {
  const { donorProfile, recipientProfile, ...rest } = user;
  let hasProfile = true;
  if (user.role === "DONOR") hasProfile = Boolean(donorProfile);
  if (user.role === "RECIPIENT") hasProfile = Boolean(recipientProfile);
  return { ...rest, hasProfile };
};

// Requires a valid, non-expired token. Rejects with 401 otherwise.
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return next(new AppError("You must be logged in to do that", 401));
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return next(new AppError("Session expired or invalid. Please log in again.", 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: PUBLIC_USER_SELECT,
    });

    if (!user) {
      return next(new AppError("Session expired or invalid. Please log in again.", 401));
    }

    if (user.status !== "ACTIVE") {
      return next(new AppError("This account is suspended", 403));
    }

    req.user = withProfileStatus(user);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect, PUBLIC_USER_SELECT, withProfileStatus };