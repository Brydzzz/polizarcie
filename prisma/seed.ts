import { prisma } from "../utils/prisma";

async function initData() {
  // TODO add some actual database initialization
  await prisma.users.upsert({
    update: {},
    create: {
      name: "Balbinka",
      email: "balbinka@gmail.com",
      gender: "F",
      meeting_status: false,
      points: 0
    },
    where: {
      email: "balbinka@gmail.com",
    },
  });
}

initData()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
