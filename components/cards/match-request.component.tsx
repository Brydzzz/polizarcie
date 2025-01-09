"use client";
import { AcceptMatchRequest, DenyMatchRequest } from "@/lib/db/matches";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { Match, User } from "@prisma/client";
import { MouseEventHandler, useEffect, useState } from "react";
import SupabaseImage from "../images/supabase-image.component";
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
          {UserOne.image ? (
            UserOne.image.includes("https") ? (
              <img src={UserOne.image} width={50} height={50} alt="Zdjęcie" />
            ) : (
              <SupabaseImage
                src={UserOne.image}
                width={50}
                height={50}
                quality={100}
                alt="Zdjęcie"
              />
            )
          ) : null}
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
