const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const interviews = await prisma.interview.findMany({
    include: {
      application: {
        include: {
          studentProfile: { include: { user: true } }
        }
      }
    }
  });
  console.log("Interviews:", JSON.stringify(interviews, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
