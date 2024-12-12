"use client";
import MatchCard from "@/components/cards/match-card-component";
import { getUnmatchedUser } from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchPage = () => {
  const user = useAppSelector(selectCurrentUser);
  console.log(user);
  const [next, goNext] = useState<Boolean>(false);
  const [user1, setUser1] = useState<User | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const firstFetch = async () => {
      if (user && !hasFetched) setHasFetched(true);
    };
    firstFetch();
  }, [user]);

  const fetchUnmatchedUser = async () => {
    if (!user) return;
    const data = await getUnmatchedUser(user.id);
    console.log(data);
    if (!data) return;
    setUser1(data);
    return data;
  };

  useEffect(() => {
    fetchUnmatchedUser();
    console.log(user1);
  }, [next]);
  useEffect(() => {
    fetchUnmatchedUser();
    console.log(user1);
  }, [hasFetched]);

  return (
    <main className={styles.container}>
      {user1 ? <MatchCard data={user1} /> : null}
    </main>
  );
};

export default MatchPage;
