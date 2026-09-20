const express = require("express");
const {
  getApiInfo,
  getHealth,
  getDbHealth,
} = require("../controllers/systemController");

const router = express.Router();

router.get("/", getApiInfo);
router.get("/health", getHealth);
router.get("/health/db", getDbHealth);

router.use("/auth", require("./authRoutes"));
router.use("/profile", require("./profileRoutes"));
router.use("/requests", require("./requestRoutes"));

module.exports = router;