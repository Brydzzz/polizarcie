import { Gender, Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma";

async function initData() {
  // TODO add some actual database initialization
  const addresses = [
    {
      id: "1",
      name: "Marszałkowska 55/73, 00-676 Warszawa",
      xCoords: 21.0148725,
      yCoords: 52.2237223,
    },
    {
      id: "2",
      name: "999, Lwowska 1, 00-660 Warszawa",
      xCoords: 21.0119943,
      yCoords: 52.2204328,
    },
    {
      id: "3",
      name: "Lwowska 1, 00-660 Warszawa",
      xCoords: 21.0117746,
      yCoords: 52.2204523,
    },
    {
      id: "4",
      name: "Marszałkowska 28, 00-576 Warszawa",
      xCoords: 21.0187853,
      yCoords: 52.2189224,
    },
    {
      id: "5",
      name: "Jana i Jędrzeja Śniadeckich 23, 00-654 Warszawa",
      xCoords: 21.0128405,
      yCoords: 52.220232,
    },
  ];
  for (const address of addresses) {
    await prisma.address.upsert({
      where: { id: address.id },
      update: address,
      create: address,
    });
  }

  const users = [
    {
      id: "dummy-user-1",
      name: "Balbinka",
      email: "balbinka@gmail.com",
      gender: Gender.FEMALE,
      meetingStatus: false,
      points: 0,
    },
    {
      id: "dummy-user-2",
      name: "Brygida",
      email: "brygida@gmail.com",
      gender: Gender.FEMALE,
      meetingStatus: false,
      points: 0,
    },
    {
      id: "dummy-user-3",
      name: "Mateusz",
      email: "mateusz@gmail.com",
      gender: Gender.MALE,
      meetingStatus: false,
      points: 0,
    },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  await prisma.restaurant.upsert({
    where: {
      name: "Marszałkowski bar mleczny",
    },
    update: { id: "1" },
    create: {
      id: "1",
      name: "Marszałkowski bar mleczny",
      addressId: "1",
      description: "smakuwa",
      openingTimeMon: new Date(0, 0, 0, 8),
      openingTimeTue: new Date(0, 0, 0, 8),
      openingTimeWen: new Date(0, 0, 0, 8),
      openingTimeThu: new Date(0, 0, 0, 8),
      openingTimeFri: new Date(0, 0, 0, 8),
      openingTimeSat: new Date(0, 0, 0, 8),
      openingTimeSun: new Date(0, 0, 0, 8),
      closingTimeMon: new Date(0, 0, 0, 19),
      closingTimeTue: new Date(0, 0, 0, 19),
      closingTimeWen: new Date(0, 0, 0, 19),
      closingTimeThu: new Date(0, 0, 0, 19),
      closingTimeFri: new Date(0, 0, 0, 19),
      closingTimeSat: new Date(0, 0, 0, 19),
      closingTimeSun: new Date(0, 0, 0, 19),
    },
  });

  await prisma.restaurant.upsert({
    where: {
      name: "Kebab dubai",
    },
    update: { id: "2" },
    create: {
      id: "2",
      name: "Kebab dubai",
      addressId: "2",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: new Date(0, 0, 0, 8),
      openingTimeTue: new Date(0, 0, 0, 8),
      openingTimeWen: new Date(0, 0, 0, 8),
      openingTimeThu: new Date(0, 0, 0, 8),
      openingTimeFri: new Date(0, 0, 0, 8),
      openingTimeSat: new Date(0, 0, 0, 8),
      openingTimeSun: new Date(0, 0, 0, 8),
      closingTimeMon: new Date(0, 0, 0, 19),
      closingTimeTue: new Date(0, 0, 0, 19),
      closingTimeWen: new Date(0, 0, 0, 19),
      closingTimeThu: new Date(0, 0, 0, 19),
      closingTimeFri: new Date(0, 0, 0, 19),
      closingTimeSat: new Date(0, 0, 0, 19),
      closingTimeSun: new Date(0, 0, 0, 19),
    },
  });
  await prisma.restaurant.upsert({
    update: { id: "3" },
    create: {
      id: "3",
      name: "Kebab king",
      addressId: "3",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: new Date(0, 0, 0, 8),
      openingTimeTue: new Date(0, 0, 0, 8),
      openingTimeWen: new Date(0, 0, 0, 8),
      openingTimeThu: new Date(0, 0, 0, 8),
      openingTimeFri: new Date(0, 0, 0, 8),
      openingTimeSat: new Date(0, 0, 0, 8),
      openingTimeSun: new Date(0, 0, 0, 8),
      closingTimeMon: new Date(0, 0, 0, 19),
      closingTimeTue: new Date(0, 0, 0, 19),
      closingTimeWen: new Date(0, 0, 0, 19),
      closingTimeThu: new Date(0, 0, 0, 19),
      closingTimeFri: new Date(0, 0, 0, 19),
      closingTimeSat: new Date(0, 0, 0, 19),
      closingTimeSun: new Date(0, 0, 0, 19),
    },
    where: {
      name: "Kebab king",
    },
  });
  await prisma.restaurant.upsert({
    update: { id: "4" },
    create: {
      id: "4",
      name: "Moza Kebab",
      addressId: "4",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: new Date(0, 0, 0, 8),
      openingTimeTue: new Date(0, 0, 0, 8),
      openingTimeWen: new Date(0, 0, 0, 8),
      openingTimeThu: new Date(0, 0, 0, 8),
      openingTimeFri: new Date(0, 0, 0, 8),
      openingTimeSat: new Date(0, 0, 0, 8),
      openingTimeSun: new Date(0, 0, 0, 8),
      closingTimeMon: new Date(0, 0, 0, 19),
      closingTimeTue: new Date(0, 0, 0, 19),
      closingTimeWen: new Date(0, 0, 0, 19),
      closingTimeThu: new Date(0, 0, 0, 19),
      closingTimeFri: new Date(0, 0, 0, 19),
      closingTimeSat: new Date(0, 0, 0, 19),
      closingTimeSun: new Date(0, 0, 0, 19),
    },
    where: {
      name: "Moza Kebab",
    },
  });
  await prisma.restaurant.upsert({
    update: { id: "5" },
    create: {
      id: "5",
      name: "Amman Kebab",
      addressId: "5",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: new Date(0, 0, 0, 8),
      openingTimeTue: new Date(0, 0, 0, 8),
      openingTimeWen: new Date(0, 0, 0, 8),
      openingTimeThu: new Date(0, 0, 0, 8),
      openingTimeFri: new Date(0, 0, 0, 8),
      openingTimeSat: new Date(0, 0, 0, 8),
      openingTimeSun: new Date(0, 0, 0, 8),
      closingTimeMon: new Date(0, 0, 0, 19),
      closingTimeTue: new Date(0, 0, 0, 19),
      closingTimeWen: new Date(0, 0, 0, 19),
      closingTimeThu: new Date(0, 0, 0, 19),
      closingTimeFri: new Date(0, 0, 0, 19),
      closingTimeSat: new Date(0, 0, 0, 19),
      closingTimeSun: new Date(0, 0, 0, 19),
    },
    where: {
      name: "Amman Kebab",
    },
  });

  const restaurantReviews = [
    {
      id: "1",
      content: "Wybitny kebab",
      restaurantId: "5",
      stars: 5,
      amountSpent: new Prisma.Decimal(23),
      createdDate: new Date("2024-11-25"),
      userId: "dummy-user-1",
    },
    {
      id: "2",
      content: "Nawet nienajgorszy",
      restaurantId: "5",
      stars: 4,
      amountSpent: new Prisma.Decimal(26),
      createdDate: new Date("2024-10-19"),
      userId: "dummy-user-2",
    },
    {
      id: "3",
      content: "Obrzydliwy! Już nigdy tam nie zjem!",
      restaurantId: "5",
      stars: 1,
      amountSpent: new Prisma.Decimal(20),
      createdDate: new Date("2024-10-31"),
      userId: "dummy-user-3",
    },
  ];
  for (const review of restaurantReviews) {
    await prisma.restaurantReview.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  const dishes = [
    {
      id: "1",
      name: "Kebab średni",
      description: "Baranina/wołowina, sórówka, pita",
      price: new Prisma.Decimal(23),
      restaurantId: "5",
    },
    {
      id: "2",
      name: "Kebab mały",
      description: "Baranina/wołowina, sórówka, pita",
      price: new Prisma.Decimal(20),
      restaurantId: "5",
    },
    {
      id: "3",
      name: "Kebab duży",
      description: "Baranina/wołowina, sórówka, pita",
      price: new Prisma.Decimal(26),
      restaurantId: "5",
    },
    {
      id: "4",
      name: "Talerz kebab",
      description: "Baranina/wołowina, sórówkai i frytki razem na talerzu",
      price: new Prisma.Decimal(30),
      restaurantId: "5",
    },
    {
      id: "5",
      name: "Fryto kebab",
      description: "Baranina/wołowina, sórówka i, frytki, w picie",
      price: new Prisma.Decimal(25),
      restaurantId: "5",
    },
  ];
  for (const dish of dishes) {
    await prisma.dish.upsert({
      where: { id: dish.id },
      update: dish,
      create: dish,
    });
  }
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
