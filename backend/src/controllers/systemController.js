const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

const getApiInfo = (req, res) => {
  res.status(200).json({
    success: true,
    message: "BloodLink API",
    version: "1.0.0",
  });
};

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: "BloodLink backend is running",
  });
};

const getDbHealth = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("Database health check failed:", error.message);
    throw new AppError("Database connection failed", 503);
  }

  res.status(200).json({
    success: true,
    message: "Database connection is healthy",
  });
};

module.exports = { getApiInfo, getHealth, getDbHealth };