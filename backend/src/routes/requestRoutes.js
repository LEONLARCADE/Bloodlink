const express = require("express");
const {
  getDonorDashboard,
  getIncomingRequests,
  respondToRequest,
  getDonorHistory,
  createRequest,
  getMyRequests,
  getRequestDetails,
  updateRequest,
  cancelRequest,
} = require("../controllers/requestController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
  respondToRequestSchema,
  createRequestSchema,
  updateRequestSchema,
} = require("../validators/requestValidators");

const router = express.Router();

router.use(protect); // every request route requires a logged-in user

// -- Donor routes --
router.get("/donor/dashboard", requireRole("DONOR"), getDonorDashboard);
router.get("/donor/incoming", requireRole("DONOR"), getIncomingRequests);
router.get("/donor/history", requireRole("DONOR"), getDonorHistory);
router.post(
  "/donor/:requestId/respond",
  requireRole("DONOR"),
  validate(respondToRequestSchema),
  respondToRequest
);

// -- Recipient routes --
// Static paths ("/mine") are registered before the "/:id" wildcard so they
// aren't swallowed by it.
router.post("/", requireRole("RECIPIENT"), validate(createRequestSchema), createRequest);
router.get("/mine", requireRole("RECIPIENT"), getMyRequests);
router.get("/:id", requireRole("RECIPIENT"), getRequestDetails);
router.patch(
  "/:id",
  requireRole("RECIPIENT"),
  validate(updateRequestSchema),
  updateRequest
);
router.post("/:id/cancel", requireRole("RECIPIENT"), cancelRequest);

module.exports = router;