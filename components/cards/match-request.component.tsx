"use client";
import defaultProfile from "@/assets/defaultProfile.svg";
import { AcceptMatchRequest, DenyMatchRequest } from "@/lib/db/matches";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { Match, User } from "@prisma/client";
import Image from "next/image";
import { MouseEventHandler, useEffect, useState } from "react";
import ModalableImage from "../images/modalable-image.component";
import styles from "./match-request.module.scss";
type Props = {
  data: Partial<Match>;
  UserOne: Partial<User>;
  onClickDecision?: MouseEventHandler;
};

const MatchRequestCard = ({ data, UserOne, onClickDecision }: Props) => {
  const [decision, setDec] = useState<number>(0);
  const [next, setNext] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const dec = async () => {
      if (!data.userOneId || !data.userTwoId) {
        return;
      }
      if (decision == 1) {
        await AcceptMatchRequest(data.userOneId, data.userTwoId);
      } else if (decision == 2) {
        await DenyMatchRequest(data.userOneId, data.userTwoId);
      }
    };
    dec();
  }, [decision, next]);
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.photoBox}>
          {UserOne.localProfileImagePath ? (
            <ModalableImage
              width={40}
              height={40}
              src={UserOne.localProfileImagePath}
              alt="Profilowe"
              quality={100}
            />
          ) : (
            <Image
              width={40}
              height={40}
              alt="Profilowe"
              src={UserOne.image || defaultProfile}
            />
          )}
        </div>
        <div className={styles.namebox}>
          {UserOne ? <p className={styles.name}>{UserOne.name}</p> : null}
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.yes}>
          <i
            className="fa-solid fa-square-check"
            onClick={() => {
              setDec(1);
              dispatch(
                addSnackbar({ message: "Zmatchowano", type: "success" })
              );
              onClickDecision;
            }}
          ></i>
        </div>
        <div className={styles.no}>
          <i
            className="fa-solid fa-square-xmark"
            onClick={() => {
              setDec(2);
              dispatch(addSnackbar({ message: "Odrzucono", type: "warning" }));
              onClickDecision;
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default MatchRequestCard;
