import { prisma } from "@/prisma";
import { Dish, DishType, Restaurant } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import slugify from "slugify";
import { ADDRESSES_DATA } from "./addresses";
import { USERS_DATA } from "./users";

const RESTAURANTS_CSV_FILEPATH = "./prisma/restaurants.csv";
const DISHES_CSV_FILEPATH = "./prisma/dishes.csv";

async function initData() {
  const users = await Promise.all(
    (
      await USERS_DATA
    ).map(
      async (data) =>
        await prisma.user.upsert({
          where: { email: data.email },
          update: data,
          create: data,
        })
    )
  );
  console.log("SEED: Users upsert completed successfully");

  const restaurants = await new Promise<Restaurant[]>((resolve, reject) => {
    const restaurantPromises: Promise<Restaurant>[] = [];
    let i = 0;
    fs.createReadStream(RESTAURANTS_CSV_FILEPATH)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        const slug = slugify(row.name, { lower: true });
        restaurantPromises.push(
          prisma.restaurant.upsert({
            where: {
              slug: slug,
            },
            update: {
              name: row.name,
              slug: slug,
              address: {
                update: {
                  data: ADDRESSES_DATA[i],
                },
              },
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
            create: {
              name: row.name,
              slug: slug,
              address: {
                create: ADDRESSES_DATA[i],
              },
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
        i += 1;
      })
      .on("end", async () => {
        try {
          const restaurants = await Promise.all(restaurantPromises);
          console.log("SEED: Restaurants upsert completed successfully");
          resolve(restaurants);
        } catch (error) {
          console.log("SEED: Restaurants upsert failed");
          reject(error);
        }
      })
      .on("error", reject);
  });

  const dishes = await new Promise<Dish[]>((resolve, reject) => {
    const dishesPromises: Promise<Dish>[] = [];
    fs.createReadStream(DISHES_CSV_FILEPATH)
      .pipe(csv({ separator: ";" }))
      .on("data", async (row) => {
        dishesPromises.push(
          prisma.dish.upsert({
            where: {
              restaurantId_name: {
                restaurantId: restaurants[row.restaurantId - 1].id,
                name: row.name,
              },
            },
            update: {
              name: row.name,
              description: row.description,
              priceZl: parseInt(row.priceZl, 10),
              priceGr: parseInt(row.priceGr, 10),
              restaurantId: restaurants[row.restaurantId - 1].id,
              type: DishType[row.type as keyof typeof DishType],
            },
            create: {
              name: row.name,
              description: row.description,
              priceZl: parseInt(row.priceZl, 10),
              priceGr: parseInt(row.priceGr, 10),
              restaurantId: restaurants[row.restaurantId - 1].id,
              type: DishType[row.type as keyof typeof DishType],
            },
          })
        );
      })
      .on("end", async () => {
        try {
          const dishes = await Promise.all(dishesPromises);
          console.log("SEED: Dishes upsert completed successfully");
          resolve(dishes);
        } catch (error) {
          console.log("SEED: Dishes upsert failed");
          reject(error);
        }
      })
      .on("error", reject);
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
