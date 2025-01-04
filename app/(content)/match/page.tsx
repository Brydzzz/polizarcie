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
  const [first, setFirst] = useState<Boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [likedRests, setLikedRests] = useState<Restaurant[][]>([[]]);
  const [status, setStatus] = useState<Boolean>(false);
  const [algo, setAlgo] = useState<boolean>(false);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
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
      setFirst(false);
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
      if (
        !user ||
        (first == false && !users[0]) ||
        (first == true && !users[1])
      )
        return;
      if (decision == 1 && first == false) {
        await matchYesWith(user.id, users[0].id);
      } else if (decision == 1 && first == true) {
        await matchYesWith(user.id, users[1].id);
      } else if (decision == 2 && first == false) {
        await matchNoWith(user.id, users[0].id);
      } else if (decision == 2 && first == true) {
        await matchNoWith(user.id, users[1].id);
      }
      if (first) {
        setLikedRests((likedRests) => {
          return likedRests.slice(1);
        });
        setUsers((users) => {
          return users.slice(1);
        });
        await pushUnmatchedUser();
      } else {
        setFirst(true);
      }
    };
    match();
  }, [next]);

  return loading ? (
    <LoaderBlur />
  ) : user ? (
    user.meetingStatus ? (
      <main className={styles.main}>
        <div className={styles.switch}>
          {algo ? (
            <p className={styles.prompt}>Niech los zadecyduje...</p>
          ) : (
            <p className={styles.prompt}>Może mam z kimś coś wspólnego?</p>
          )}
          <Switch checked={algo} onChange={handleSwitch} />
        </div>
        <div className={styles.container}>
          <div>
            {!first && users[0] ? (
              <MatchCard
                data={users[0]}
                likedRests={likedRests[0]}
                algo={algo}
              />
            ) : first && users[1] ? (
              <MatchCard
                data={users[1]}
                likedRests={likedRests[1]}
                algo={algo}
              />
            ) : null}
          </div>
          {users[1] || (users[0] && !first) ? (
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

        {users[0] && first ? (
          <div className={styles.back}>
            <div className={styles.card}>
              {users[0] && first ? (
                <MatchCard
                  data={users[0]}
                  likedRests={likedRests[0]}
                  algo={algo}
                />
              ) : null}
            </div>
            <div className={styles.card}>
              {users[2] ? (
                <div className={styles.card}>
                  <MatchCard
                    data={users[2]}
                    likedRests={likedRests[2]}
                    algo={algo}
                  />
                </div>
              ) : users[1] && !first ? (
                <MatchCard
                  data={users[1]}
                  likedRests={likedRests[1]}
                  algo={algo}
                />
              ) : null}
            </div>
          </div>
        ) : (
          <div className={styles.oneCard}>
            {users[2] && first ? (
              <MatchCard
                data={users[2]}
                likedRests={likedRests[2]}
                algo={algo}
              />
            ) : users[1] && !first ? (
              <MatchCard
                data={users[1]}
                likedRests={likedRests[1]}
                algo={algo}
              />
            ) : null}
          </div>
        )}
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
    <main className={styles.main}>
      <div className={styles.login}>
        <LoginNeeded />
      </div>
    </main>
  );
};

export default MatchPage;
