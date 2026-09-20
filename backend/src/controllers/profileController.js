const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");

// GET /api/profile/me
// Returns the caller's own donor/recipient profile, or null if they haven't
// completed onboarding yet. ADMIN accounts have no profile concept.
const getMyProfile = async (req, res, next) => {
  try {
    const { id: userId, role } = req.user;

    let profile = null;
    if (role === "DONOR") {
      profile = await prisma.donorProfile.findUnique({ where: { userId } });
    } else if (role === "RECIPIENT") {
      profile = await prisma.recipientProfile.findUnique({ where: { userId } });
    }

    res.status(200).json({ success: true, profile });
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile/donor  (requireRole("DONOR"))
// Upsert keeps this endpoint idempotent: same call creates the profile on
// first use (onboarding) and updates it on every later edit.
const upsertDonorProfile = async (req, res, next) => {
  try {
    const { bloodGroup, district, state, isAvailable, lastDonationDate } = req.body;

    const data = {
      bloodGroup,
      district,
      state: state || null,
      isAvailable: isAvailable ?? true,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
    };

    const profile = await prisma.donorProfile.upsert({
      where: { userId: req.user.id },
      create: { ...data, userId: req.user.id },
      update: data,
    });

    res.status(200).json({
      success: true,
      message: "Donor profile saved",
      profile,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/profile/recipient  (requireRole("RECIPIENT"))
const upsertRecipientProfile = async (req, res, next) => {
  try {
    const { bloodGroup, district, state } = req.body;

    const data = {
      bloodGroup: bloodGroup || null,
      district,
      state: state || null,
    };

    const profile = await prisma.recipientProfile.upsert({
      where: { userId: req.user.id },
      create: { ...data, userId: req.user.id },
      update: data,
    });

    res.status(200).json({
      success: true,
      message: "Recipient profile saved",
      profile,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return next(new AppError("A profile already exists for this account", 409));
    }
    next(err);
  }
};

module.exports = { getMyProfile, upsertDonorProfile, upsertRecipientProfile };