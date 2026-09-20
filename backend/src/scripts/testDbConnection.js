const prisma = require("../utils/prisma");

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log(`Database connection successful. users table found (${userCount} rows).`);
  } catch (error) {
    console.error("Database connection FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();