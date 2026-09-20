const express = require("express");
const {
  getMyProfile,
  upsertDonorProfile,
  upsertRecipientProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  donorProfileSchema,
  recipientProfileSchema,
} = require("../validators/profileValidators");

const router = express.Router();

router.use(protect); // every profile route requires a logged-in user

router.get("/me", getMyProfile);

router.put(
  "/donor",
  requireRole("DONOR"),
  validate(donorProfileSchema),
  upsertDonorProfile
);

router.put(
  "/recipient",
  requireRole("RECIPIENT"),
  validate(recipientProfileSchema),
  upsertRecipientProfile
);

module.exports = router;