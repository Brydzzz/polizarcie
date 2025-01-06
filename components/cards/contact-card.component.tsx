"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { User, UserMedia } from "@prisma/client";
import { MouseEventHandler, useState } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize } from "../button/button.types";
import SupabaseImage from "../images/supabase-image.component";
import styles from "./contact-card.module.scss";
import LinkCard from "./link-card.component";
type Props = {
  data: Partial<User>;
  medias: Partial<UserMedia>[];
  onClickDelete?: MouseEventHandler;
};

const ContactCard = ({ data, medias, onClickDelete }: Props) => {
  const [more, setMore] = useState<Boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.photoBox}>
          {data.image ? (
            data.image.includes("https") ? (
              <img src={data.image} width={30} height={30} alt="Zdjęcie" />
            ) : (
              <SupabaseImage
                src={data.image}
                width={30}
                height={30}
                quality={50}
                alt="Zdjęcie"
              />
            )
          ) : null}
        </div>
        <div className={styles.namebox}>
          {data ? <p className={styles.name}>{data.name}</p> : null}
        </div>
      </div>
      <ol className={styles.medias}>
        {medias?.map((link, type) => (
          <LinkCard key={type} data={link}></LinkCard>
        ))}
      </ol>
      <div className={styles.right}>
        {more ? (
          <div className={styles.delete}>
            <Button
              size={ButtonSize.SMALL}
              color={ButtonColor.SECONDARY}
              onClick={onClickDelete}
            >
              Usuń z kontaktów
            </Button>
          </div>
        ) : null}
        <i
          className="fa-solid fa-ellipsis-vertical"
          onClick={() => setMore(!more)}
        ></i>
      </div>
    </div>
  );
};

export default ContactCard;
