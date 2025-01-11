"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { User, UserMedia } from "@prisma/client";
import { MouseEventHandler, useState } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize } from "../button/button.types";
import styles from "./contact-card.module.scss";
import LinkCard from "./link-card.component";
import ModalableImage from "../images/modalable-image.component";
import Image from "next/image";
import defaultProfile from "@/assets/defaultProfile.svg";
type Props = {
  data: Partial<User>;
  medias: Partial<UserMedia>[];
  onClickDelete?: MouseEventHandler;
};

const ContactCard = ({ data, medias, onClickDelete }: Props) => {
  const [more, setMore] = useState<Boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  const size = useAppSelector(selectViewportWidth);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.photoBox}>
          {data.localProfileImagePath ? (
            <ModalableImage
              width={35}
              height={35}
              src={data.localProfileImagePath}
              alt="Profilowe"
              quality={100}
            />
          ) : (
            <Image
              width={35}
              height={35}
              alt="Profilowe"
              src={data.image || defaultProfile}
            />
          )}
        </div>
        <div className={styles.namebox}>
          {data ? <p className={styles.name}>{data.name}</p> : null}
        </div>
        <ol className={styles.medias}>
          {medias?.map((link, type) => (
            <LinkCard key={type} data={link}></LinkCard>
          ))}
        </ol>
      </div>

      <div
        className={size > ViewportSize.MD ? styles.right : styles.rightMobile}
      >
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
