"use server"

import { get_restaurants_like } from "@/utils/prisma/restaurants"

export async function get_restaurants_by_name(name: string) {
    return get_restaurants_like(name);
}