const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const reqs = await prisma.recruiterProfile.findMany({
    where: {
      NOT: {
        editRequest: { equals: Prisma.AnyNull }
      }
    }
  });
  console.log("Found:", reqs.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
