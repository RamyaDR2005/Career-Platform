const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const token = await prisma.verificationToken.findFirst({
    orderBy: { expires: 'desc' }
  });
  console.log("Latest OTP Token:", token);
}
main().catch(console.error).finally(() => prisma.$disconnect());
