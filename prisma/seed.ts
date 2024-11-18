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
      points: 0,
    },
    where: {
      email: "balbinka@gmail.com",
    },
  });
  const addresses = [
    {
      address_id: 1,
      name: "Marszałkowska 55/73, 00-676 Warszawa",
      X_coords: 52.22384809269264,
      Y_coords: 21.014972257671275,
    },
    {
      address_id: 2,
      name: "999, Lwowska 1, 00-660 Warszawa",
      X_coords: 52.222647666815845,
      Y_coords: 21.011307754440278,
    },
    {
      address_id: 3,
      name: "Lwowska 1, 00-660 Warszawa",
      X_coords: 52.22252816861938,
      Y_coords: 21.0111360496488,
    },
    {
      address_id: 4,
      name: "Marszałkowska 28, 00-576 Warszawa",
      X_coords: 52.21953492198973,
      Y_coords: 21.018708227263527,
    },
    {
      address_id: 5,
      name: "Jana i Jędrzeja Śniadeckich 23, 00-654 Warszawa",
      X_coords: 52.22049482276576,
      Y_coords: 21.0120639520506,
    },
  ];
  for (const address of addresses) {
    await prisma.address.upsert({
      where: { name: address.name },
      update: address,
      create: address,
    });
  }
  await prisma.restaurant.upsert({
    where: {
      name: "Marszałkowski bar mleczny",
    },
    update: { address_id: 1 },
    create: {
      name: "Marszałkowski bar mleczny",
      address_id: 1,
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
    update: { address_id: 2 },
    create: {
      name: "Kebab dubai",
      address_id: 2,
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
    update: { address_id: 3 },
    create: {
      name: "Kebab king",
      address_id: 3,
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
    },
  });
  await prisma.restaurant.upsert({
    update: { address_id: 4 },
    create: {
      name: "Moza Kebab",
      address_id: 4,
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
      name: "Moza Kebab",
    },
  });
  await prisma.restaurant.upsert({
    update: { address_id: 5 },
    create: {
      name: "Amman Kebab",
      address_id: 5,
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
      name: "Amman Kebab",
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
