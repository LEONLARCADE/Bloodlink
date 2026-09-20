const { z } = require("zod");

// Matches the Prisma UserRole enum. ADMIN accounts are not self-service —
// there's no legitimate flow for a stranger to register as an admin.
const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Enter a valid email address"),
    phone: z
      .string()
      .trim()
      .max(20, "Phone number is too long")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long") // bcrypt's hard limit
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number"),
    confirmPassword: z.string(),
    role: z.enum(["DONOR", "RECIPIENT"], {
      error: "Select whether you are a donor or recipient",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };