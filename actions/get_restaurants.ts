"use server"

import { get_all_restaurants } from "@/utils/prisma/restaurants";


export async function get_restaurants() {
    return get_all_restaurants();
}