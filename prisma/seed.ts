import { prisma } from "../utils/prisma";

async function initData() {
  // TODO add some actual database initialization
  await prisma.user.upsert({
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
  await prisma.restaurant.upsert({
    where: {
      name: "Marszałkowski bar mleczny",
    },
    update: {
      description: "smakuwa",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
    create: {
      name: "Marszałkowski bar mleczny",
      description: "smakuwa",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
  });

  await prisma.restaurant.upsert({
    where: {
      name: "Kebab dubai",
    },
    update: {
      description: "prawdziwy kebab piecze dwa razy",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
    create: {
      name: "Kebab dubai",
      description: "prawdziwy kebab piecze dwa razy",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
  });
  await prisma.restaurant.upsert({
    update: {},
    create: {
      name: "Kebab king",
      description: "prawdziwy kebab piecze dwa razy",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
    where: {
      name: "Kebab king",
    }
  });
  await prisma.restaurant.upsert({
    update: {},
    create: {
      name: "Kebab relax",
      description: "prawdziwy kebab piecze dwa razy",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
    where: {
      name: "Kebab relax",
    }
  });
    await prisma.restaurant.upsert({
    update: {},
    create: {
      name: "Kebab habiba",
      description: "prawdziwy kebab piecze dwa razy",
      opening_hour_mon: 8,
      opening_hour_tue: 8,
      opening_hour_wen: 8,
      opening_hour_thu: 8,
      opening_hour_fri: 8,
      opening_hour_sat: 8,
      opening_hour_sun: 8,
      closing_hour_mon: 19,
      closing_hour_tue: 19,
      closing_hour_wen: 19,
      closing_hour_thu: 19,
      closing_hour_fri: 19,
      closing_hour_sat: 19,
      closing_hour_sun: 19,
    },
    where: {
      name: "Kebab habiba",
    }
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
