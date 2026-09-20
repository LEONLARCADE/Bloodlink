const { z } = require("zod");

const respondToRequestSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"], {
    error: "Status must be ACCEPTED or DECLINED",
  }),
  note: z.string().trim().max(500, "Note is too long").optional().or(z.literal("")),
});

// Mirrors the Prisma BloodGroup enum exactly (kept in sync with profileValidators.js).
const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .optional()
  .or(z.literal(""));

const createRequestSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, { error: "Select a valid blood group" }),
  unitsRequired: z.coerce
    .number()
    .int("Must be a whole number")
    .min(1, "At least 1 unit is required")
    .max(20, "That's more units than we can list — please contact support")
    .optional()
    .default(1),
  district: z
    .string({ error: "District is required" })
    .trim()
    .min(2, "District is required")
    .max(100, "District is too long"),
  hospitalName: z
    .string()
    .trim()
    .max(150, "Hospital name is too long")
    .optional()
    .or(z.literal("")),
  patientName: z
    .string()
    .trim()
    .max(150, "Patient name is too long")
    .optional()
    .or(z.literal("")),
  urgency: z.enum(["NORMAL", "URGENT", "CRITICAL"]).optional().default("NORMAL"),
  neededBy: dateOnly,
  notes: z.string().trim().max(1000, "Notes are too long").optional().or(z.literal("")),
});

// Same shape, but with no defaults applied and every field optional — an
// update should only touch the fields the recipient actually changed, not
// silently reset unitsRequired/urgency to their create-time defaults.
const updateRequestSchema = z
  .object({
    bloodGroup: z.enum(BLOOD_GROUPS, { error: "Select a valid blood group" }),
    unitsRequired: z.coerce
      .number()
      .int("Must be a whole number")
      .min(1, "At least 1 unit is required")
      .max(20, "That's more units than we can list — please contact support"),
    district: z
      .string({ error: "District is required" })
      .trim()
      .min(2, "District is required")
      .max(100, "District is too long"),
    hospitalName: z
      .string()
      .trim()
      .max(150, "Hospital name is too long")
      .or(z.literal("")),
    patientName: z
      .string()
      .trim()
      .max(150, "Patient name is too long")
      .or(z.literal("")),
    urgency: z.enum(["NORMAL", "URGENT", "CRITICAL"]),
    neededBy: dateOnly,
    notes: z.string().trim().max(1000, "Notes are too long").or(z.literal("")),
  })
  .partial();

module.exports = {
  respondToRequestSchema,
  createRequestSchema,
  updateRequestSchema,
  BLOOD_GROUPS,
};