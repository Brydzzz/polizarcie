"use server"

import { prisma } from "@/utils/prisma"
import { Restaurant } from "@prisma/client"
import { json } from "stream/consumers";

export async function get_all_restaurants() {
    const restaurants = await prisma.restaurant.findMany();
    return restaurants
}

export async function get_restaurants_like(like:string) {
    const restaurants = await prisma.restaurant.findMany({
        where: {
            name: { contains: like, mode: 'insensitive' }
        }
    });
    return restaurants;
}