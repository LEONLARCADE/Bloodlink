const prisma = require("../utils/prisma");
const AppError = require("../utils/AppError");
const { getDonorEligibility, mostRecentDate } = require("../utils/donorEligibility");

// Requests that can still receive a donor response.
const OPEN_STATUSES = ["OPEN", "IN_PROGRESS"];
// Once a request leaves these statuses, the recipient can no longer edit or cancel it.
const EDITABLE_STATUSES = ["OPEN", "IN_PROGRESS"];

const getDonorProfileOrThrow = async (userId) => {
  const profile = await prisma.donorProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError("Complete your donor profile first", 409);
  }
  return profile;
};

const getRecipientProfileOrThrow = async (userId) => {
  const profile = await prisma.recipientProfile.findUnique({ where: { userId } });
  if (!profile) {
    throw new AppError("Complete your recipient profile first", 409);
  }
  return profile;
};

// GET /api/requests/donor/dashboard  (requireRole("DONOR"))
const getDonorDashboard = async (req, res, next) => {
  try {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(200).json({
        success: true,
        hasProfile: false,
        profile: null,
        eligibility: null,
        stats: null,
        nearbyRequests: [],
      });
    }

    const lastCompletedResponse = await prisma.requestResponse.findFirst({
      where: { donorId: profile.id, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true },
    });

    const effectiveLastDonation = mostRecentDate(
      profile.lastDonationDate,
      lastCompletedResponse?.completedAt
    );
    const eligibility = getDonorEligibility(effectiveLastDonation);

    const [nearbyRequests, nearbyRequestsCount, totalDonations, pendingResponses] =
      await Promise.all([
        prisma.bloodRequest.findMany({
          where: {
            status: "OPEN",
            bloodGroup: profile.bloodGroup,
            district: profile.district,
          },
          orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
          take: 5,
        }),
        prisma.bloodRequest.count({
          where: {
            status: "OPEN",
            bloodGroup: profile.bloodGroup,
            district: profile.district,
          },
        }),
        prisma.requestResponse.count({
          where: { donorId: profile.id, status: "COMPLETED" },
        }),
        prisma.requestResponse.count({
          where: { donorId: profile.id, status: "PENDING" },
        }),
      ]);

    res.status(200).json({
      success: true,
      hasProfile: true,
      profile,
      eligibility,
      stats: {
        totalDonations,
        pendingResponses,
        nearbyRequestsCount,
      },
      nearbyRequests,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/donor/incoming  (requireRole("DONOR"))
// Blood requests matching the donor's own blood group and district that are
// still open for a response, annotated with the donor's own response status.
const getIncomingRequests = async (req, res, next) => {
  try {
    const profile = await getDonorProfileOrThrow(req.user.id);

    const requests = await prisma.bloodRequest.findMany({
      where: {
        status: { in: OPEN_STATUSES },
        bloodGroup: profile.bloodGroup,
        district: profile.district,
      },
      orderBy: [{ urgency: "desc" }, { createdAt: "desc" }],
      include: {
        responses: {
          where: { donorId: profile.id },
          select: { status: true, note: true, createdAt: true },
        },
      },
    });

    const incoming = requests.map(({ responses, ...request }) => ({
      ...request,
      myResponse: responses[0] || null,
    }));

    res.status(200).json({ success: true, requests: incoming });
  } catch (err) {
    next(err);
  }
};

// POST /api/requests/donor/:requestId/respond  (requireRole("DONOR"))
const respondToRequest = async (req, res, next) => {
  try {
    const profile = await getDonorProfileOrThrow(req.user.id);
    const { requestId } = req.params;
    const { status, note } = req.body;

    const request = await prisma.bloodRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      return next(new AppError("Blood request not found", 404));
    }
    if (!OPEN_STATUSES.includes(request.status)) {
      return next(new AppError("This request is no longer open for responses", 409));
    }

    const response = await prisma.requestResponse.upsert({
      where: { requestId_donorId: { requestId, donorId: profile.id } },
      create: {
        requestId,
        donorId: profile.id,
        status,
        note: note || null,
      },
      update: {
        status,
        note: note || null,
      },
    });

    // First acceptance moves the request into progress; it stays there even
    // if other donors later decline, and only an admin/recipient action
    // (a later phase) moves it to FULFILLED.
    if (status === "ACCEPTED" && request.status === "OPEN") {
      await prisma.bloodRequest.update({
        where: { id: requestId },
        data: { status: "IN_PROGRESS" },
      });
    }

    res.status(200).json({
      success: true,
      message: status === "ACCEPTED" ? "Response accepted" : "Request declined",
      response,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/donor/history  (requireRole("DONOR"))
const getDonorHistory = async (req, res, next) => {
  try {
    const profile = await getDonorProfileOrThrow(req.user.id);

    const [completed, upcoming] = await Promise.all([
      prisma.requestResponse.findMany({
        where: { donorId: profile.id, status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        include: { request: true },
      }),
      prisma.requestResponse.findMany({
        where: { donorId: profile.id, status: "ACCEPTED" },
        orderBy: { createdAt: "desc" },
        include: { request: true },
      }),
    ]);

    const lastCompletedDate = completed[0]?.completedAt || null;
    const effectiveLastDonation = mostRecentDate(profile.lastDonationDate, lastCompletedDate);
    const eligibility = getDonorEligibility(effectiveLastDonation);

    res.status(200).json({
      success: true,
      completed,
      upcoming,
      eligibility,
    });
  } catch (err) {
    next(err);
  }
};

// -- Recipient endpoints --------------------------------------------------

// POST /api/requests  (requireRole("RECIPIENT"))
const createRequest = async (req, res, next) => {
  try {
    const profile = await getRecipientProfileOrThrow(req.user.id);
    const { bloodGroup, unitsRequired, district, hospitalName, patientName, urgency, neededBy, notes } =
      req.body;

    const request = await prisma.bloodRequest.create({
      data: {
        recipientId: profile.id,
        bloodGroup,
        unitsRequired,
        district,
        hospitalName: hospitalName || null,
        patientName: patientName || null,
        urgency,
        neededBy: neededBy ? new Date(neededBy) : null,
        notes: notes || null,
      },
    });

    res.status(201).json({ success: true, message: "Blood request created", request });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/mine  (requireRole("RECIPIENT"))
const getMyRequests = async (req, res, next) => {
  try {
    const profile = await getRecipientProfileOrThrow(req.user.id);

    const requests = await prisma.bloodRequest.findMany({
      where: { recipientId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { responses: true } },
      },
    });

    res.status(200).json({ success: true, requests });
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id  (requireRole("RECIPIENT"))
// Scoped to the caller's own recipient profile, so a request belonging to
// someone else simply doesn't exist as far as this endpoint is concerned —
// no separate 403 branch needed, and it avoids confirming other users' data.
const getRequestDetails = async (req, res, next) => {
  try {
    const profile = await getRecipientProfileOrThrow(req.user.id);
    const { id } = req.params;

    const request = await prisma.bloodRequest.findFirst({
      where: { id, recipientId: profile.id },
      include: {
        responses: {
          orderBy: { createdAt: "desc" },
          include: {
            donor: {
              select: {
                bloodGroup: true,
                district: true,
                // Only surface donor contact details once they've actually
                // accepted — a pending/declined response tells the
                // recipient nothing they need a phone number for yet.
                user: { select: { fullName: true, phone: true } },
              },
            },
          },
        },
      },
    });

    if (!request) {
      return next(new AppError("Blood request not found", 404));
    }

    // Strip donor contact info for anything that isn't an accepted response.
    const sanitized = {
      ...request,
      responses: request.responses.map((r) => ({
        ...r,
        donor: {
          bloodGroup: r.donor.bloodGroup,
          district: r.donor.district,
          user: r.status === "ACCEPTED" || r.status === "COMPLETED" ? r.donor.user : null,
        },
      })),
    };

    res.status(200).json({ success: true, request: sanitized });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/requests/:id  (requireRole("RECIPIENT"))
const updateRequest = async (req, res, next) => {
  try {
    const profile = await getRecipientProfileOrThrow(req.user.id);
    const { id } = req.params;

    const existing = await prisma.bloodRequest.findFirst({
      where: { id, recipientId: profile.id },
    });
    if (!existing) {
      return next(new AppError("Blood request not found", 404));
    }
    if (!EDITABLE_STATUSES.includes(existing.status)) {
      return next(
        new AppError(`A ${existing.status.toLowerCase()} request can no longer be edited`, 409)
      );
    }

    const { bloodGroup, unitsRequired, district, hospitalName, patientName, urgency, neededBy, notes } =
      req.body;

    const data = {};
    if (bloodGroup !== undefined) data.bloodGroup = bloodGroup;
    if (unitsRequired !== undefined) data.unitsRequired = unitsRequired;
    if (district !== undefined) data.district = district;
    if (hospitalName !== undefined) data.hospitalName = hospitalName || null;
    if (patientName !== undefined) data.patientName = patientName || null;
    if (urgency !== undefined) data.urgency = urgency;
    if (neededBy !== undefined) data.neededBy = neededBy ? new Date(neededBy) : null;
    if (notes !== undefined) data.notes = notes || null;

    const request = await prisma.bloodRequest.update({ where: { id }, data });

    res.status(200).json({ success: true, message: "Request updated", request });
  } catch (err) {
    next(err);
  }
};

// POST /api/requests/:id/cancel  (requireRole("RECIPIENT"))
const cancelRequest = async (req, res, next) => {
  try {
    const profile = await getRecipientProfileOrThrow(req.user.id);
    const { id } = req.params;

    const existing = await prisma.bloodRequest.findFirst({
      where: { id, recipientId: profile.id },
    });
    if (!existing) {
      return next(new AppError("Blood request not found", 404));
    }
    if (!EDITABLE_STATUSES.includes(existing.status)) {
      return next(
        new AppError(`A ${existing.status.toLowerCase()} request cannot be cancelled`, 409)
      );
    }

    const request = await prisma.bloodRequest.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    res.status(200).json({ success: true, message: "Request cancelled", request });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDonorDashboard,
  getIncomingRequests,
  respondToRequest,
  getDonorHistory,
  createRequest,
  getMyRequests,
  getRequestDetails,
  updateRequest,
  cancelRequest,
};