"use client";
import MatchCard from "@/components/cards/match-card-component";
import { matchNoWith, matchYesWith } from "@/lib/db/matches";
import { getUnmatchedUser, getUnmatchedUsers } from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchPage = () => {
  const [next, goNext] = useState<boolean>(false);
  const [decision, setDec] = useState<Number>(0);
  const [users, setUsers] = useState<User[]>([]);
  // const [user1, setUser1] = useState<User | undefined>();
  const user = useAppSelector(selectCurrentUser);

  const pushUnmatchedUser = async () => {
    if (!user) return;
    console.log(users.map((usr) => usr.id));
    const data = await getUnmatchedUser(
      user.id,
      users.map((usr) => usr.id)
    );
    console.log(data);
    if (!data) return;
    setUsers((users) => [...users, data]);
  };
  useEffect(() => {
    const initUsers = async () => {
      if (!user) return;
      const data = await getUnmatchedUsers(user.id, [], 4);
      console.log(data);
      setUsers(data);
    };
    initUsers();
  }, [user]);

  useEffect(() => {
    const match = async () => {
      if (!user || !users[1]) return;
      if (decision == 1) {
        matchYesWith(user.id, users[1].id);
      } else {
        matchNoWith(user.id, users[1].id);
      }
    };
    match();
    setUsers((users) => {
      return users.slice(1);
    });
    pushUnmatchedUser();
    console.log(users);
  }, [next]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div>{users[1] ? <MatchCard data={users[1]} /> : null}</div>
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
      </div>
      <div className={styles.back}>
        <div className={styles.card}>
          {users[0] && decision != 0 ? <MatchCard data={users[0]} /> : null}
        </div>
        <div className={styles.card}>
          {users[2] ? <MatchCard data={users[2]} /> : null}
        </div>
      </div>
    </main>
  );
};

export default MatchPage;
