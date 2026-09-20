const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/jwt");
const { PUBLIC_USER_SELECT, withProfileStatus } = require("../middleware/auth");
const {
  isProduction,
  AUTH_COOKIE_NAME,
  JWT_COOKIE_MAX_AGE_MS,
} = require("../config/env");

const SALT_ROUNDS = 12;

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // requires HTTPS in production
  sameSite: isProduction ? "none" : "lax", // "none" needed for cross-site prod (Vercel <-> API host)
  maxAge: JWT_COOKIE_MAX_AGE_MS,
  path: "/",
};

const sendAuthCookie = (res, userId) => {
  const token = signToken(userId);
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions);
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return next(new AppError("An account with this email already exists", 409));
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        passwordHash,
        role,
      },
      select: PUBLIC_USER_SELECT,
    });

    sendAuthCookie(res, user.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: withProfileStatus(user),
    });
  } catch (err) {
    // Prisma unique constraint race (two simultaneous registrations, same email)
    if (err.code === "P2002") {
      return next(new AppError("An account with this email already exists", 409));
    }
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        donorProfile: { select: { id: true } },
        recipientProfile: { select: { id: true } },
      },
    });

    // Same message whether the email doesn't exist or the password is wrong —
    // never reveal which one it was.
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    if (user.status !== "ACTIVE") {
      return next(new AppError("This account is suspended", 403));
    }

    sendAuthCookie(res, user.id);

    const { passwordHash: _omit, ...publicUser } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: withProfileStatus(publicUser),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// GET /api/auth/me
const me = (req, res) => {
  // req.user is attached by the `protect` middleware
  res.status(200).json({ success: true, user: req.user });
};

module.exports = { register, login, logout, me };