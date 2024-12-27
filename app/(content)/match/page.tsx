"use client";
import MatchCard from "@/components/cards/match-card-component";
import { matchNoWith, matchYesWith } from "@/lib/db/matches";
import {
  getTopLikedRests,
  getTopLikedRestsForUsers,
  getUnmatchedUser,
  getUnmatchedUsers,
} from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { Restaurant, User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchPage = () => {
  const [next, goNext] = useState<boolean>(false);
  const [decision, setDec] = useState<Number>(0);
  const [first, setFirst] = useState<Boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [likedRests, setLikedRests] = useState<Restaurant[][]>([[]]);
  // const [user1, setUser1] = useState<User | undefined>();
  const user = useAppSelector(selectCurrentUser);

  const pushUnmatchedUser = async () => {
    if (!user) return;
    const data = await getUnmatchedUser(
      user,
      users.map((usr) => usr.id)
    );
    if (!data) return;
    const rests = await getTopLikedRests(data.id);
    if (rests) {
      setLikedRests((likedRests) => [...likedRests, rests]);
    }
    setUsers((users) => [...users, data]);
  };
  useEffect(() => {
    const initUsers = async () => {
      if (!user) return;
      const data = await getUnmatchedUsers(user, [], 4);
      setUsers(data);
      if (data) {
        const rests = await getTopLikedRestsForUsers(data.map((usr) => usr.id));
        if (rests) {
          setLikedRests(rests);
        }
      }
    };
    initUsers();
    console.log(users);
  }, [user]);

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
    console.log(users);
  }, [next]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>
          {decision == 0 && users[0] ? (
            <MatchCard data={users[0]} likedRests={likedRests[0]} />
          ) : decision != 0 && users[1] ? (
            <MatchCard data={users[1]} likedRests={likedRests[1]} />
          ) : null}
        </div>
        {users[1] || (users[0] && decision == 0) ? (
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
              <MatchCard data={users[0]} likedRests={likedRests[0]} />
            ) : null}
          </div>
          <div className={styles.card}>
            {users[2] ? (
              <MatchCard data={users[2]} likedRests={likedRests[2]} />
            ) : users[1] && first ? (
              <MatchCard data={users[1]} likedRests={likedRests[1]} />
            ) : null}
          </div>
        </div>
      ) : (
        <div className={styles.oneCard}>
          {users[2] ? (
            <MatchCard data={users[2]} likedRests={likedRests[2]} />
          ) : users[1] && first ? (
            <MatchCard data={users[1]} likedRests={likedRests[1]} />
          ) : null}
        </div>
      )}
    </main>
  );
};

export default MatchPage;
