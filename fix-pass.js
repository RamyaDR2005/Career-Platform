const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123456', 10);
  await prisma.user.update({
    where: { email: 'sdmcetplacement12@gmail.com' },
    data: { password: hash }
  });
  console.log("Password reset to 123456");
}
main().catch(console.error).finally(() => prisma.$disconnect());
