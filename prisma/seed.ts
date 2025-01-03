import { prisma } from "@/prisma";
import { hashPassword } from "@/utils/misc";
import { DishType, Gender, Role } from "@prisma/client";
import slugify from "slugify";
import { addresses } from "./temp_adresses";
import fs from 'fs';
import csv from 'csv-parser';


async function initData() {
  // TODO add some actual database initialization

  /*
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
  }*/

  for (const address of addresses) {
    await prisma.address.upsert({
      where: { id: address.id },
      update: address,
      create: address,
    });
  }

  const users = [
    {
      id: "dummyUser1",
      name: "Balbinka",
      email: "balbinka@gmail.com",
      gender: Gender.FEMALE,
      meetingStatus: false,
      points: 0,
      roles: [Role.ADMIN],
      emailVerified: "2137-01-01T08:00:00.000Z",
      passwordHash: {
        connectOrCreate: {
          where: {
            forUserEmail: "balbinka@gmail.com",
          },
          create: {
            hash: (await hashPassword("balbinka")).toString("base64"),
          },
        },
      },
    },
    {
      id: "dummyUser2",
      name: "Brygida",
      email: "brygida@gmail.com",
      gender: Gender.FEMALE,
      meetingStatus: false,
      points: 0,
      roles: [Role.MODERATOR],
      emailVerified: "2137-01-01T08:00:00.000Z",
      passwordHash: {
        connectOrCreate: {
          where: {
            forUserEmail: "brygida@gmail.com",
          },
          create: {
            hash: (await hashPassword("brygida")).toString("base64"),
          },
        },
      },
    },
    {
      id: "dummyUser4",
      name: "Noobek",
      email: "noobek@gmail.com",
      gender: Gender.MALE,
      meetingStatus: false,
      points: 0,
      roles: [Role.USER],
      emailVerified: "2137-01-01T08:00:00.000Z",
      passwordHash: {
        connectOrCreate: {
          where: {
            forUserEmail: "noobek@gmail.com",
          },
          create: {
            hash: (await hashPassword("noobek")).toString("base64"),
          },
        },
      },
    },
    {
      id: "dummyUser3",
      name: "Mateusz",
      email: "mateusz@gmail.com",
      gender: Gender.MALE,
      meetingStatus: false,
      points: 0,
      roles: [Role.MODERATOR],
      emailVerified: "2137-01-01T08:00:00.000Z",
      passwordHash: {
        connectOrCreate: {
          where: {
            forUserEmail: "mateusz@gmail.com",
          },
          create: {
            hash: (await hashPassword("mateusz")).toString("base64"),
          },
        },
      },
    },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }


  const csvFilePath = "./prisma/restaurants.csv";

  const restaurantPromises: any[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        restaurantPromises.push(
          prisma.restaurant.upsert({
            where: {
              name: row.name,
            },
            update: { id: row.id },
            create: {
              id: row.id,
              name: row.name,
              slug: slugify(row.name, { lower: true }),
              addressId: row.addressId,
              description: row.description,
              openingTimeMon: row.openingTimeMon,
              openingTimeTue: row.openingTimeTue,
              openingTimeWen: row.openingTimeWen,
              openingTimeThu: row.openingTimeThu,
              openingTimeFri: row.openingTimeFri,
              openingTimeSat: row.openingTimeSat,
              openingTimeSun: row.openingTimeSun,
              closingTimeMon: row.closingTimeMon,
              closingTimeTue: row.closingTimeTue,
              closingTimeWen: row.closingTimeWen,
              closingTimeThu: row.closingTimeThu,
              closingTimeFri: row.closingTimeFri,
              closingTimeSat: row.closingTimeSat,
              closingTimeSun: row.closingTimeSun,
            },
          })
        );
      })
      .on('end', async () => {
        console.log('CSV restaurants successfully processed');
        try {
          await Promise.all(restaurantPromises);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });

  //const restaurants = await prisma.restaurant.findMany();
  //console.log(restaurants);
  /*
  await prisma.restaurant.upsert({
    where: {
      name: "Marszałkowski bar mleczny",
    },
    update: { id: "1" },
    create: {
      id: "1",
      name: "Marszałkowski bar mleczny",
      slug: slugify("Marszałkowski bar mleczny", { lower: true }),
      addressId: "1",
      description: "smakuwa",
      openingTimeMon: "2137-01-01T08:00:00.000Z",
      openingTimeTue: "2137-01-01T08:00:00.000Z",
      openingTimeWen: "2137-01-01T08:00:00.000Z",
      openingTimeThu: "2137-01-01T08:00:00.000Z",
      openingTimeFri: "2137-01-01T08:00:00.000Z",
      openingTimeSat: "2137-01-01T08:00:00.000Z",
      openingTimeSun: "2137-01-01T08:00:00.000Z",
      closingTimeMon: "2137-01-01T19:00:00.000Z",
      closingTimeTue: "2137-01-01T19:00:00.000Z",
      closingTimeWen: "2137-01-01T19:00:00.000Z",
      closingTimeThu: "2137-01-01T19:00:00.000Z",
      closingTimeFri: "2137-01-01T19:00:00.000Z",
      closingTimeSat: "2137-01-01T19:00:00.000Z",
      closingTimeSun: "2137-01-01T19:00:00.000Z",
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
      slug: slugify("Kebab dubai", { lower: true }),
      addressId: "2",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: "2137-01-01T08:00:00.000Z",
      openingTimeTue: "2137-01-01T08:00:00.000Z",
      openingTimeWen: "2137-01-01T08:00:00.000Z",
      openingTimeThu: "2137-01-01T08:00:00.000Z",
      openingTimeFri: "2137-01-01T08:00:00.000Z",
      openingTimeSat: "2137-01-01T08:00:00.000Z",
      openingTimeSun: "2137-01-01T08:00:00.000Z",
      closingTimeMon: "2137-01-01T19:00:00.000Z",
      closingTimeTue: "2137-01-01T19:00:00.000Z",
      closingTimeWen: "2137-01-01T19:00:00.000Z",
      closingTimeThu: "2137-01-01T19:00:00.000Z",
      closingTimeFri: "2137-01-01T19:00:00.000Z",
      closingTimeSat: "2137-01-01T19:00:00.000Z",
      closingTimeSun: "2137-01-01T19:00:00.000Z",
    },
  });
  await prisma.restaurant.upsert({
    update: { id: "3" },
    create: {
      id: "3",
      name: "Kebab king",
      slug: slugify("Kebab King", { lower: true }),
      addressId: "3",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: "2137-01-01T08:00:00.000Z",
      openingTimeTue: "2137-01-01T08:00:00.000Z",
      openingTimeWen: "2137-01-01T08:00:00.000Z",
      openingTimeThu: "2137-01-01T08:00:00.000Z",
      openingTimeFri: "2137-01-01T08:00:00.000Z",
      openingTimeSat: "2137-01-01T08:00:00.000Z",
      openingTimeSun: "2137-01-01T08:00:00.000Z",
      closingTimeMon: "2137-01-01T19:00:00.000Z",
      closingTimeTue: "2137-01-01T19:00:00.000Z",
      closingTimeWen: "2137-01-01T19:00:00.000Z",
      closingTimeThu: "2137-01-01T19:00:00.000Z",
      closingTimeFri: "2137-01-01T19:00:00.000Z",
      closingTimeSat: "2137-01-01T19:00:00.000Z",
      closingTimeSun: "2137-01-01T19:00:00.000Z",
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
      slug: slugify("Moza Kebab", { lower: true }),
      addressId: "4",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: "2137-01-01T08:00:00.000Z",
      openingTimeTue: "2137-01-01T08:00:00.000Z",
      openingTimeWen: "2137-01-01T08:00:00.000Z",
      openingTimeThu: "2137-01-01T08:00:00.000Z",
      openingTimeFri: "2137-01-01T08:00:00.000Z",
      openingTimeSat: "2137-01-01T08:00:00.000Z",
      openingTimeSun: "2137-01-01T08:00:00.000Z",
      closingTimeMon: "2137-01-01T19:00:00.000Z",
      closingTimeTue: "2137-01-01T19:00:00.000Z",
      closingTimeWen: "2137-01-01T19:00:00.000Z",
      closingTimeThu: "2137-01-01T19:00:00.000Z",
      closingTimeFri: "2137-01-01T19:00:00.000Z",
      closingTimeSat: "2137-01-01T19:00:00.000Z",
      closingTimeSun: "2137-01-01T19:00:00.000Z",
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
      slug: slugify("Amman Kebab", { lower: true }),
      addressId: "5",
      description: "prawdziwy kebab piecze dwa razy",
      openingTimeMon: "2137-01-01T08:00:00.000Z",
      openingTimeTue: "2137-01-01T08:00:00.000Z",
      openingTimeWen: "2137-01-01T08:00:00.000Z",
      openingTimeThu: "2137-01-01T08:00:00.000Z",
      openingTimeFri: "2137-01-01T08:00:00.000Z",
      openingTimeSat: "2137-01-01T08:00:00.000Z",
      openingTimeSun: "2137-01-01T08:00:00.000Z",
      closingTimeMon: "2137-01-01T19:00:00.000Z",
      closingTimeTue: "2137-01-01T19:00:00.000Z",
      closingTimeWen: "2137-01-01T19:00:00.000Z",
      closingTimeThu: "2137-01-01T19:00:00.000Z",
      closingTimeFri: "2137-01-01T19:00:00.000Z",
      closingTimeSat: "2137-01-01T19:00:00.000Z",
      closingTimeSun: "2137-01-01T19:00:00.000Z",
    },
    where: {
      name: "Amman Kebab",
    },
  });
  */


  const csvFilePath2 = "./prisma/dishes.csv";

  fs.createReadStream(csvFilePath2)
  .pipe(csv({ separator: ';' }))
    .on('data', async (row) => {
      console.log(row);
      await prisma.dish.upsert({
        where: {
          id: row.id,
        },
        update: { id: row.id },
        create: {
          id: row.id,
          name: row.name,
          description: row.description,
          priceZl: parseInt(row.priceZl, 10),
          priceGr: parseInt(row.priceGr, 10),
          restaurantId: row.restaurantId,
          type: DishType[row.type as keyof typeof DishType],
        },
      });
    })
  .on('end', () => {
    console.log('CSV restaurants successfully processed');
  });

  /*
  const dishes = [
    {
      id: "1",
      name: "Kebab średni",
      description: "Baranina/wołowina, surówka, pita",
      priceZl: 23,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.MAIN_DISH,
    },
    {
      id: "2",
      name: "Kebab mały",
      description: "Baranina/wołowina, surówka, pita",
      priceZl: 20,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.MAIN_DISH,
    },
    {
      id: "3",
      name: "Kebab duży",
      description: "Baranina/wołowina, surówka, pita",
      priceZl: 26,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.MAIN_DISH,
    },
    {
      id: "4",
      name: "Talerz kebab",
      description: "Baranina/wołowina, surówka i frytki razem na talerzu",
      priceZl: 30,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.MAIN_DISH,
    },
    {
      id: "5",
      name: "Fryto kebab",
      description: "Baranina/wołowina, surówka i, frytki, w picie",
      priceZl: 25,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.MAIN_DISH,
    },
    {
      id: "6",
      name: "Baklawa",
      description: "Tradycyjne tureckie ciastko",
      priceZl: 7,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.DESSERT,
    },
    {
      id: "7",
      name: "Frytki",
      description: "Z keczupem",
      priceZl: 12,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.STARTER,
    },
    {
      id: "8",
      name: "Surówka",
      description: "Z kapusty",
      priceZl: 6,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.STARTER,
    },
    {
      id: "9",
      name: "Ciastko",
      description: "Czekoladowe",
      priceZl: 4,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.DESSERT,
    },
    {
      id: "10",
      name: "Coca-Cola",
      description: "0.5l",
      priceZl: 6,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.DRINK,
    },
    {
      id: "11",
      name: "Ajran",
      description: "1l",
      priceZl: 7,
      priceGr: 0,
      restaurantId: "5",
      type: DishType.DRINK,
    },
  ];
  for (const dish of dishes) {
    console.log(dish);
    await prisma.dish.upsert({
      where: { id: dish.id },
      update: dish,
      create: dish,
    });
  }*/
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
