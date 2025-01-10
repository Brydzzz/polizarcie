//'use client';

import ReviewList from "@/components/lists/review-list.component";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";
//import { getUserMediaById } from '@/lib/db/users';
import defaultProfile from "@/assets/defaultProfile.svg";
import ModalableImage from "@/components/images/modalable-image.component";
import { getUserById } from "@/lib/db/users";
import Image from "next/image";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ProfilePage = async ({ params }: Props) => {
  const id = (await params).id;
  const user = await getUserById(id);

  if (!user) notFound();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          {user.localProfileImagePath ? (
            <ModalableImage
              width={100}
              height={100}
              src={user.localProfileImagePath}
              alt="Profilowe"
              quality={75}
            />
          ) : (
            <Image
              width={100}
              height={100}
              alt="Profilowe"
              src={user.image || defaultProfile}
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

export default ProfilePage;
