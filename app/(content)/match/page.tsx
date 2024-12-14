"use client";
import UserCard from "@/components/cards/user-desc-card-component";
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
  }, [user]);

  return (
    <main className={styles.container}>
      {user1 ? <UserCard data={user1} socials={false} /> : null}
    </main>
  );
};

export default MatchPage;
