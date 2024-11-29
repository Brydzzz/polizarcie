import { prisma } from "../utils/prisma";

async function initData() {
  // TODO add some actual database initialization
  const addresses = [
    {
      address_id: 1,
      name: "Marszałkowska 55/73, 00-676 Warszawa",
      X_coords: 21.0148725,
      Y_coords: 52.2237223,
    },
    {
      address_id: 2,
      name: "999, Lwowska 1, 00-660 Warszawa",
      Y_coords: 52.2204328,
      X_coords: 21.0119943,
    },
    {
      address_id: 3,
      name: "Lwowska 1, 00-660 Warszawa",
      Y_coords: 52.2204523,
      X_coords: 21.0117746,
    },
    {
      address_id: 4,
      name: "Marszałkowska 28, 00-576 Warszawa",
      Y_coords: 52.2189224,
      X_coords: 21.0187853,
    },
    {
      address_id: 5,
      name: "Jana i Jędrzeja Śniadeckich 23, 00-654 Warszawa",
      Y_coords: 52.220232,
      X_coords: 21.0128405,
    },
  ];
  for (const address of addresses) {
    await prisma.address.upsert({
      where: { name: address.name },
      update: address,
      create: address,
    });
  }

  const dishes = [
    {
      dish_id: 1,
      name: "Kebab średni",
      description: "Baranina/wołowina, sórówka, pita",
      price: 23,
      restaurant_id: 5,
    },
    {
      dish_id: 2,
      name: "Kebab mały",
      description: "Baranina/wołowina, sórówka, pita",
      price: 20,
      restaurant_id: 5,
    },
    {
      dish_id: 3,
      name: "Kebab duży",
      description: "Baranina/wołowina, sórówka, pita",
      price: 26,
      restaurant_id: 5,
    },
    {
      dish_id: 4,
      name: "Talerz kebab",
      description: "Baranina/wołowina, sórówkai i frytki razem na talerzu",
      price: 30,
      restaurant_id: 5,
    },
    {
      dish_id: 5,
      name: "Fryto kebab",
      description: "Baranina/wołowina, sórówka i, frytki, w picie",
      price: 25,
      restaurant_id: 5,
    },
  ];
  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { dish_id: dish.dish_id },
      update: dish,
      create: dish,
    });
  }

  const users = [
    {
      user_id: 1,
      login: "@balbi",
      name: "Balbinka",
      email: "balbinka@gmail.com",
      gender: "F",
      meeting_status: false,
      points: 0,
    },
    {
      user_id: 3,
      name: "Brygida",
      login: "@brydzz",
      email: "brygida@gmail.com",
      gender: "F",
      meeting_status: false,
      points: 0,
    },
    {
      user_id: 2,
      name: "Mateusz",
      login: "@mati04",
      email: "mateusz@gmail.com",
      gender: "M",
      meeting_status: false,
      points: 0,
    },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { user_id: user.user_id },
      update: user,
      create: user,
    });
  }

  const reviews = [
    {
      review_id: 1,
      content: "Wybitny kebab",
      restaurant_id: 5,
      points: 5,
      spent_per_person: 23,
      date: new Date("2024-11-25"),
      who_wrote: 1,
    },
    {
      review_id: 2,
      content: "Nawet nienajgorszy",
      restaurant_id: 5,
      points: 4,
      spent_per_person: 26,
      date: new Date("2024-10-19"),
      who_wrote: 2,
    },
    {
      review_id: 3,
      content: "Obrzydliwy! Już nigdy tam nie zjem!",
      restaurant_id: 5,
      points: 1,
      spent_per_person: 20,
      date: new Date("2024-10-31"),
      who_wrote: 3,
    },
  ];
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { review_id: review.review_id },
      update: review,
      create: review,
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
      restaurant_id: 5,
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
