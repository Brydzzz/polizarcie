import { Restaurant } from "@prisma/client";

export function isRestaurantOpen(restaurant: Restaurant): boolean {
  const currentDateTime = new Date();
  const day = currentDateTime.getDay();
  const time = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();

  let openingTime: Date | undefined;
  let closingTime: Date | undefined;

  switch (day) {
    case 0:
      openingTime = restaurant.openingTimeSun;
      closingTime = restaurant.closingTimeSun;
      break;
    case 1:
      openingTime = restaurant.openingTimeMon;
      closingTime = restaurant.closingTimeMon;
      break;
    case 2:
      openingTime = restaurant.openingTimeTue;
      closingTime = restaurant.closingTimeTue;
      break;
    case 3:
      openingTime = restaurant.openingTimeWen;
      closingTime = restaurant.closingTimeWen;
      break;
    case 4:
      openingTime = restaurant.openingTimeThu;
      closingTime = restaurant.closingTimeThu;
      break;
    case 5:
      openingTime = restaurant.openingTimeFri;
      closingTime = restaurant.closingTimeFri;
      break;
    case 6:
      openingTime = restaurant.openingTimeSat;
      closingTime = restaurant.closingTimeSat;
      break;
  }

  if (!openingTime || !closingTime) {
    return false;
  }

  const openingTimeMin = openingTime.getHours() * 60 + openingTime.getMinutes();
  const closingTimeMin = closingTime.getHours() * 60 + closingTime.getMinutes();
  if (time >= openingTimeMin && time <= closingTimeMin) {
    return true;
  }

  return false;
}
