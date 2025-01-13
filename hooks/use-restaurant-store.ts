"use client";

import { RestaurantCreator } from "@/lib/db/restaurants";
import { parseMinutesToString } from "@/utils/misc";
import { Decimal } from "@prisma/client/runtime/index-browser.js";
import { Dispatch, SetStateAction, useState } from "react";

const storeDefaults: {
  name: string;
  description: string;
  openingTimeMon: number;
  openingTimeTue: number;
  openingTimeWen: number;
  openingTimeThu: number;
  openingTimeFri: number;
  openingTimeSat: number;
  openingTimeSun: number;
  closingTimeMon: number;
  closingTimeTue: number;
  closingTimeWen: number;
  closingTimeThu: number;
  closingTimeFri: number;
  closingTimeSat: number;
  closingTimeSun: number;
  enabledMon: boolean;
  enabledTue: boolean;
  enabledWen: boolean;
  enabledThu: boolean;
  enabledFri: boolean;
  enabledSat: boolean;
  enabledSun: boolean;
  addressName: string;
  addressXcoords: string;
  addressYcoords: string;
} = {
  name: "",
  description: "",
  openingTimeMon: 8 * 60,
  openingTimeTue: 8 * 60,
  openingTimeWen: 8 * 60,
  openingTimeThu: 8 * 60,
  openingTimeFri: 8 * 60,
  openingTimeSat: 8 * 60,
  openingTimeSun: 8 * 60,
  closingTimeMon: 18 * 60,
  closingTimeTue: 18 * 60,
  closingTimeWen: 18 * 60,
  closingTimeThu: 18 * 60,
  closingTimeFri: 18 * 60,
  closingTimeSat: 18 * 60,
  closingTimeSun: 18 * 60,
  enabledMon: true,
  enabledTue: true,
  enabledWen: true,
  enabledThu: true,
  enabledFri: true,
  enabledSat: true,
  enabledSun: true,
  addressName: "",
  addressXcoords: "",
  addressYcoords: "",
};

type Store = {
  [Key in keyof typeof storeDefaults]: [
    (typeof storeDefaults)[Key],
    Dispatch<SetStateAction<(typeof storeDefaults)[Key]>>
  ];
};

const WEEKDAYS = {
  Mon: true,
  Tue: true,
  Wen: true,
  Thu: true,
  Fri: true,
  Sat: true,
  Sun: true,
};

const useRestaurantStore = () => {
  const dict = Object.entries(storeDefaults)
    .map(([key, value]) => {
      const keyHelper = key as keyof typeof storeDefaults;
      return {
        [key]: useState<(typeof storeDefaults)[typeof keyHelper]>(value),
      };
    })
    .reduce((acc, v) => ({ ...acc, ...v }), {}) as Store;

  const loadData = (data?: RestaurantCreator) => {
    if (data) {
      dict["name"][1](data.name);
      dict["description"][1](data.description);
      if (data.address) {
        dict["addressName"][1](data.address.name);
        dict["addressXcoords"][1](new Decimal(data.address.xCoords).toFixed(6));
        dict["addressYcoords"][1](new Decimal(data.address.yCoords).toFixed(6));
      }
      Object.keys(WEEKDAYS).forEach((key) => {
        const weekday = key as keyof typeof WEEKDAYS;
        const opening = Math.floor(
          new Date(data[`openingTime${weekday}`]).getTime() / 1000 / 60
        );
        const closing = Math.floor(
          new Date(data[`closingTime${weekday}`]).getTime() / 1000 / 60
        );
        dict[`openingTime${weekday}`][1](opening);
        dict[`closingTime${weekday}`][1](closing);
        dict[`enabled${weekday}`][1](opening !== closing);
      });
    }
  };

  const getKeys = (): (keyof typeof storeDefaults)[] => {
    return Object.keys(storeDefaults) as (keyof typeof storeDefaults)[];
  };

  const getState = <Key extends keyof typeof storeDefaults>(
    key: Key
  ): (typeof storeDefaults)[Key] => {
    return dict[key][0];
  };

  const setState = <Key extends keyof typeof storeDefaults>(
    key: Key,
    value: (typeof storeDefaults)[Key]
  ) => {
    dict[key][1](value);
  };

  const getCreator = (): RestaurantCreator => {
    const raw = Object.entries(dict)
      .map((e) => ({ [e[0]]: e[1][0] }))
      .reduce((acc, v) => ({ ...acc, ...v }), {}) as typeof storeDefaults;
    const none = new Date("2137-01-01T00:00:00.000Z");
    return {
      name: raw.name,
      description: raw.description,
      openingTimeMon: raw.enabledMon
        ? new Date(parseMinutesToString(raw.openingTimeMon, true))
        : none,
      openingTimeTue: raw.enabledTue
        ? new Date(parseMinutesToString(raw.openingTimeTue, true))
        : none,
      openingTimeWen: raw.enabledWen
        ? new Date(parseMinutesToString(raw.openingTimeWen, true))
        : none,
      openingTimeThu: raw.enabledThu
        ? new Date(parseMinutesToString(raw.openingTimeThu, true))
        : none,
      openingTimeFri: raw.enabledFri
        ? new Date(parseMinutesToString(raw.openingTimeFri, true))
        : none,
      openingTimeSat: raw.enabledSat
        ? new Date(parseMinutesToString(raw.openingTimeSat, true))
        : none,
      openingTimeSun: raw.enabledSun
        ? new Date(parseMinutesToString(raw.openingTimeSun, true))
        : none,
      closingTimeMon: raw.enabledMon
        ? new Date(parseMinutesToString(raw.closingTimeMon, true))
        : none,
      closingTimeTue: raw.enabledTue
        ? new Date(parseMinutesToString(raw.closingTimeTue, true))
        : none,
      closingTimeWen: raw.enabledWen
        ? new Date(parseMinutesToString(raw.closingTimeWen, true))
        : none,
      closingTimeThu: raw.enabledThu
        ? new Date(parseMinutesToString(raw.closingTimeThu, true))
        : none,
      closingTimeFri: raw.enabledFri
        ? new Date(parseMinutesToString(raw.closingTimeFri, true))
        : none,
      closingTimeSat: raw.enabledSat
        ? new Date(parseMinutesToString(raw.closingTimeSat, true))
        : none,
      closingTimeSun: raw.enabledSun
        ? new Date(parseMinutesToString(raw.closingTimeSun, true))
        : none,
      address: {
        name: raw.addressName,
        xCoords: new Decimal(raw.addressXcoords),
        yCoords: new Decimal(raw.addressYcoords),
      },
    };
  };

  const reset = () => {
    Object.entries(storeDefaults).forEach(([key, value]) => {
      const keyHelper = key as keyof typeof storeDefaults;
      setState(keyHelper, value);
    });
  };

  return { getKeys, getState, setState, getCreator, reset, loadData };
};

export default useRestaurantStore;
