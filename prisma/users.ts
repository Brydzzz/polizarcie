import { hashPassword } from "@/utils/misc";
import { Gender, Role } from "@prisma/client";

const getData = async () => [
  {
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

export const USERS_DATA = getData();
