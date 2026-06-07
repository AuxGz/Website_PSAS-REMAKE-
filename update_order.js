const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.order.update({
    where: { id: '134f8c81-5e64-4c25-ac77-dc868673e15e' },
    data: { status: 'PAID', paidAt: new Date() }
  });
  console.log("Order updated to PAID.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
