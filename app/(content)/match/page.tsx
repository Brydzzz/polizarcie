"use client";
import MatchCard from "@/components/cards/match-card-component";
import { getUnmatchedUser } from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchPage = () => {
  const [next, goNext] = useState<Boolean>(false);
  const [user1, setUser1] = useState<User | undefined>();
  const user = useAppSelector(selectCurrentUser);

  // useEffect(() => {
  //   fetchUnmatchedUser();
  //   console.log(user1);
  // }, [next]);
  useEffect(() => {
    const fetchUnmatchedUser = async () => {
      if (!user) return;
      const data = await getUnmatchedUser(user.id);
      console.log(data);
      if (!data) return;
      setUser1(data);
      console.log(data);
    };
    fetchUnmatchedUser();
    console.log(user1);
  }, [user]);

  return (
    <main className={styles.container}>
      <div>{user1 ? <MatchCard data={user1} /> : null}</div>
    </main>
  );
};

export default MatchPage;
