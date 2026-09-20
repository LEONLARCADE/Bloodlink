const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client");
const { DATABASE_URL } = require("../config/env");

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Set it in backend/.env");
}

// Node caches this module, so all files share ONE client.
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

module.exports = prisma;