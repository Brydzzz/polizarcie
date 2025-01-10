//'use client';

import ReviewList from "@/components/lists/review-list.component";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";
//import { getUserMediaById } from '@/lib/db/users';
import defaultProfile from "@/assets/defaultProfile.svg";
import SupabaseImage from "@/components/images/supabase-image.component";
import { getUserById, getUserMedias } from "@/lib/db/users";
import { User, UserMedia } from "@prisma/client";
import Image from "next/image";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const ProfilePage = async ({ params }: Props) => {
  const slug = (await params).slug;
  const user = await getUserById(slug);

  if (!user) notFound();
  const userMediaResult = await getUserMedias(user.id);
  const data: Partial<User & { medias: Partial<UserMedia>[] }> = {
    ...user,
    medias: userMediaResult || [],
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          {user.image ? (
            user.image.startsWith("http") ? (
              <Image
                width={100}
                height={100}
                alt="Profilowe"
                src={user.image}
              />
            ) : (
              <SupabaseImage
                width={100}
                height={100}
                src={user.image}
                alt="Profilowe"
              />
            )
          ) : (
            <Image
              width={100}
              height={100}
              alt="Profilowe"
              src={defaultProfile}
            />
          )}
        </div>
        <h1>{user.name}</h1>
      </div>
      <div className={styles.info}>{user.description}</div>
      <div className={styles.reviews}>
        <h2>Opinie użytkownika:</h2>
        <ReviewList mode="author" authorId={user.id}></ReviewList>
      </div>
    </div>
  );
};

// ...existing code...

export default ProfilePage;
