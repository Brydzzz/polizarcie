"use client";
import Button from "@/components/button/button.component";
import {
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from "@/components/button/button.types";
import MatchCard from "@/components/cards/match-card-component";
import Switch from "@/components/inputs/switch.component";
import LoaderBlur from "@/components/misc/loader-blur.component";
import LoginNeeded from "@/components/misc/login-needed.component";
import { matchNoWith, matchYesWith } from "@/lib/db/matches";
import {
  getSimilarRestsForUsers,
  getSimilarRestsLike,
  getTopLikedRests,
  getTopLikedRestsForUsers,
  getUnmatchedSimilarUser,
  getUnmatchedSimilarUsers,
  getUnmatchedUser,
  getUnmatchedUsers,
  turnOnMeeting,
} from "@/lib/db/users";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import { setCurrentUser } from "@/lib/store/user/user.slice";
import { Restaurant, User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchPage = () => {
  const [next, goNext] = useState<boolean>(false);
  const [decision, setDec] = useState<Number>(0);
  //const [first, setFirst] = useState<Boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [likedRests, setLikedRests] = useState<Restaurant[][]>([[]]);
  const [status, setStatus] = useState<Boolean>(false);
  const [algo, setAlgo] = useState<boolean>(false);
  const [prevUser, setPrevUser] = useState<User>();
  const [prevRests, setPrevRests] = useState<Restaurant[]>([]);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const size = useAppSelector(selectViewportWidth);
  const dispatch = useAppDispatch();

  const pushUnmatchedUser = async () => {
    if (!user) return;
    const data = algo
      ? await getUnmatchedSimilarUser(
          user,
          users.map((usr) => usr.id)
        )
      : await getUnmatchedUser(
          user,
          users.map((usr) => usr.id)
        );
    console.log(data);
    if (!data) return;
    const rests = algo
      ? await getSimilarRestsLike(user.id, data.id)
      : await getTopLikedRests(data.id);
    if (rests) {
      setLikedRests((likedRests) => [...likedRests, rests]);
    }
    setUsers((users) => [...users, data]);
  };
  useEffect(() => {
    const reloadUser = async () => {
      if (!user) return;
      const copy = Object.assign({}, user);
      copy.meetingStatus = true;
      dispatch(setCurrentUser(copy));
    };
    reloadUser();
  }, [status]);
  useEffect(() => {
    const reloadEnv = async () => {
      setDec(0);
    };
    reloadEnv();
  }, [algo]);
  useEffect(() => {
    const initUsers = async () => {
      if (!user) return;
      const data = algo
        ? await getUnmatchedSimilarUsers(user, [], 4)
        : await getUnmatchedUsers(user, [], 4);
      setUsers(data);
      if (data) {
        const rests = algo
          ? await getSimilarRestsForUsers(
              user.id,
              data.map((usr) => usr.id)
            )
          : await getTopLikedRestsForUsers(data.map((usr) => usr.id));
        if (rests) {
          setLikedRests(rests);
        }
      }
    };
    initUsers();
    console.log(users);
  }, [user, loading, algo]);
  const handleSwitch = () => {
    setAlgo(!algo);
  };
  useEffect(() => {
    const match = async () => {
      if (!user || !users[0]) return;
      if (decision == 1) {
        await matchYesWith(user.id, users[0].id);
      } else if (decision == 2) {
        await matchNoWith(user.id, users[0].id);
      }
      setPrevUser(users[0]);
      setPrevRests(likedRests[0]);
      setLikedRests((likedRests) => {
        return likedRests.slice(1);
      });
      setUsers((users) => {
        return users.slice(1);
      });
      await pushUnmatchedUser();
    };
    match();
  }, [next]);

  return loading ? (
    <LoaderBlur />
  ) : user ? (
    user.meetingStatus ? (
      <main className={styles.main}>
        <div
          className={
            size > ViewportSize.SM ? styles.switch : styles.switchMobile
          }
        >
          {algo ? (
            <p className={styles.prompt}>Niech los zadecyduje...</p>
          ) : (
            <p className={styles.prompt}>Może mam z kimś coś wspólnego?</p>
          )}
          <Switch checked={algo} onChange={handleSwitch} />
        </div>
        <div className={styles.container}>
          {users[0] ? (
            <MatchCard data={users[0]} likedRests={likedRests[0]} algo={algo} />
          ) : (
            <p
              className={
                size > ViewportSize.SM ? styles.notFound : styles.notFoundMobile
              }
            >
              Nie znaleziono żadnych kanydatów, wróć później
            </p>
          )}

          {users[0] ? (
            <div className={styles.buttons}>
              <div className={styles.yes}>
                <i
                  className="fa-solid fa-square-check"
                  onClick={() => {
                    goNext(!next);
                    setDec(1);
                  }}
                ></i>
              </div>
              <div className={styles.no}>
                <i
                  className="fa-solid fa-square-xmark"
                  onClick={() => {
                    goNext(!next);
                    setDec(2);
                  }}
                ></i>
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.back}>
          <div className={styles.card}>
            {prevUser && users[0] && size > ViewportSize.MD ? (
              <MatchCard data={prevUser} likedRests={prevRests} algo={algo} />
            ) : null}
          </div>
          <div className={styles.card}>
            {users[1] && size > ViewportSize.MD ? (
              <div className={styles.card}>
                <MatchCard
                  data={users[1]}
                  likedRests={likedRests[1]}
                  algo={algo}
                />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    ) : (
      <main className={styles.main}>
        <div className={styles.turnMeeting}>
          <div className={styles.box}>
            <div className={styles.message}>
              <p>
                Musisz włączyć opcje spotykania się z innymi, zrób to klikając w
                ten przycisk:
              </p>
            </div>
            <div className={styles.button}>
              {user.id ? (
                <Button
                  style={ButtonStyle.SOLID}
                  color={ButtonColor.PRIMARY}
                  size={ButtonSize.LARGE}
                  onClick={() => {
                    turnOnMeeting(user.id);
                    setStatus(!status);
                  }}
                >
                  Poznajmy się!
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    )
  ) : (
    <main className={styles.main2}>
      <div className={styles.login}>
        <LoginNeeded />
      </div>
    </main>
  );
};

export default MatchPage;
