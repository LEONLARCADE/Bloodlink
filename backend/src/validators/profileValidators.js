const { z } = require("zod");

// Mirrors the Prisma BloodGroup enum exactly.
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

const donorProfileSchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS, {
    error: "Select a valid blood group",
  }),
  district: z
    .string()
    .trim()
    .min(2, "District is required")
    .max(100, "District is too long"),
  state: z.string().trim().max(100, "State is too long").optional().or(z.literal("")),
  isAvailable: z.boolean().optional().default(true),
  lastDonationDate: dateOnly,
});

const recipientProfileSchema = z.object({
  // Nullable/optional to match the schema — the account holder may not know
  // their own blood group; it's the specific request that needs one.
  bloodGroup: z.enum(BLOOD_GROUPS).optional().or(z.literal("")),
  district: z
    .string()
    .trim()
    .min(2, "District is required")
    .max(100, "District is too long"),
  state: z.string().trim().max(100, "State is too long").optional().or(z.literal("")),
});

module.exports = { donorProfileSchema, recipientProfileSchema, BLOOD_GROUPS };