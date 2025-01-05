//'use client';

import React from 'react';
import MainHeader from '../../../components/headers/main-header.component';
import UserCard from '@/components/cards/user-desc-card-component';
import styles from './page.module.scss';
import {
  getMenuByRestaurantId,
} from "@/lib/db/restaurants";
import MenuList from "@/components/lists/menu-list.component";
import ReviewList from "@/components/lists/review-list.component";
import { getRestaurantById } from '@/lib/db/restaurants';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/utils/users';
//import { getUserMediaById } from '@/lib/db/users';
import { User, UserMedia } from "@prisma/client";
import { getUserMedias } from '@/lib/db/users';
import ClientSupabaseImage from './profile-image';

const ProfilePage = async () => {
    const restaurant = await getRestaurantById("1");
    const user = await getCurrentUser();
    
    if (!restaurant || !user) notFound();
    const userMediaResult = await getUserMedias(user.id);
    const data: Partial<User & { medias: Partial<UserMedia>[] }> = {
        ...user,
        medias: userMediaResult || []
      };
    // const userData = {
    //     name: "John Doe",
    //     description: "Software Engineer",
    //     medias: [
    //     ]
    // };
    const menu = await getMenuByRestaurantId(restaurant.id);

    return (
        <>
        <div>
            <MainHeader />
            <div className={styles.container}>
                <div className={styles.imageContainer}>
                    <ClientSupabaseImage src={user?.image ?? undefined} />
                </div>
                <div className={styles.userCardContainer}>
                    <UserCard data={data} socials={true} />
                </div>
            </div>
            <div className={styles.revievLikedsection}>
                <ReviewList mode="author" authorId={user.id}></ReviewList>
            </div>
        </div>
        </>
    );
};

// ...existing code...

export default ProfilePage;