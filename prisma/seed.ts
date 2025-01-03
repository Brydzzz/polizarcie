import { prisma } from "@/prisma";
import { hashPassword } from "@/utils/misc";
import { DishType, Gender, Role } from "@prisma/client";
import slugify from "slugify";
import { addresses } from "./temp_adresses";
import fs from 'fs';
import csv from 'csv-parser';


async function initData() {
  // TODO add some actual database initialization

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
          //console.log(row);
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

  const csvFilePath2 = "./prisma/dishes.csv";

  fs.createReadStream(csvFilePath2)
  .pipe(csv({ separator: ';' }))
    .on('data', async (row) => {
      //console.log(row);
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
