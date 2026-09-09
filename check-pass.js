const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'sdmcetplacement12@gmail.com' }
  });
  console.log("User hash:", user.password);
  const is123456 = await bcrypt.compare('123456', user.password);
  console.log("Is it 123456?", is123456);
}
main().catch(console.error).finally(() => prisma.$disconnect());
