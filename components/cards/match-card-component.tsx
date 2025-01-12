"use client";
import defaultProfile from "@/assets/defaultProfile.svg";
import { Restaurant, User } from "@prisma/client";
import Image from "next/image";
import ModalableImage from "../images/modalable-image.component";
import styles from "./match-card.module.scss";
import UserCard from "./user-desc-card-component";
type Props = {
  data: Partial<User>;
  likedRests: Partial<Restaurant>[];
  algo: Boolean;
};

const MatchCard = ({ data, likedRests, algo }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.photoBox}>
        {data.localProfileImagePath ? (
          <ModalableImage
            width={162}
            height={162}
            src={data.localProfileImagePath}
            alt="Profilowe"
            quality={100}
          />
        ) : (
          <Image
            width={162}
            height={162}
            alt="Profilowe"
            src={data.image || defaultProfile}
          />
        )}
      </div>
      <div className={styles.details}>
        <div className={styles.restaurants}>
          {algo ? <p>Łączy nas: </p> : <p> Lubię jeść: </p>}
          {Array.from({ length: 3 }, (_, idx) => (
            <p key={idx}>
              {idx + 1}. {likedRests?.[idx]?.name || "-----"}
            </p>
          ))}
        </div>
        <div className={styles.desc}>
          <UserCard data={data} socials={false}></UserCard>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
