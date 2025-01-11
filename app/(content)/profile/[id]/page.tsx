import defaultProfile from "@/assets/defaultProfile.svg";
import ModalableImage from "@/components/images/modalable-image.component";
import ReviewList from "@/components/lists/review-list.component";
import { getUserById } from "@/lib/db/users";
import { getCurrentUser } from "@/utils/users";
import { Gender, Role } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{
    id: string;
  }>;
  onDashboard?: boolean;
};

const GENDER_MAP: {
  [key in Gender]: string;
} = {
  [Gender.NOT_SET]: "Nieznana",
  [Gender.FEMALE]: "Kobieta",
  [Gender.MALE]: "Mężczyzna",
  [Gender.NON_BINARY]: "Nie binarna",
};

const ROLE_MAP: {
  [key in Role]: string;
} = {
  [Role.USER]: "Poliżarłok",
  [Role.MODERATOR]: "Moderator",
  [Role.ADMIN]: "Bóg",
};

const ProfilePage = async ({ params, onDashboard }: Props) => {
  const id = (await params).id;
  const currentUser = await getCurrentUser();
  if (!onDashboard && currentUser && currentUser.id === id)
    redirect("/dashboard/my-profile");
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
      <div className={styles.info}>
        <div className={styles.entry}>
          <h3>Rola:</h3>
          {user.roles.map((role) => ROLE_MAP[role]).join(", ")}
        </div>
        <div className={styles.entry}>
          <h3>Płeć:</h3>
          {GENDER_MAP[user.gender]}
        </div>
        <div className={styles.entry}>
          <h3>Romantyczna preferencja:</h3>
          {GENDER_MAP[user.preferredGender]}
        </div>
        {user.description && (
          <>
            <h3>Opis:</h3>
            {user.description}
          </>
        )}
        {user.medias.length > 0 && (
          <>
            <h3>Media:</h3>
            {user.medias.map((media, i) => (
              <div key={i} className={styles.entry}>
                <h4>{media.type}:</h4>
                <Link href={media.link} target="_blank">
                  {media.link}
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
      <div className={styles.reviews}>
        <h2>Opinie od użytkownika:</h2>
        <ReviewList mode="author" authorId={user.id}></ReviewList>
      </div>
    </div>
  );
};

export default ProfilePage;
