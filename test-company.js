const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.findUnique({ where: { name: "VISA" } });
  console.log("Exists:", !!company, company);
}
main().catch(console.error).finally(() => prisma.$disconnect());
