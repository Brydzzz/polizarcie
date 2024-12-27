"use client";
import MatchRequestCard from "@/components/cards/match-request.component";
import { getPendingRequestsFor } from "@/lib/db/matches";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { Match, User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchRequestPage = () => {
  const [decision, setDec] = useState<boolean>(false);
  const [requests, setRequests] = useState<
    Array<Partial<Match & { userOne: Partial<User> }>>
  >([]);
  const user = useAppSelector(selectCurrentUser);
  useEffect(() => {
    const fetchReqs = async () => {
      console.log(user);
      if (!user) return;
      const data = await getPendingRequestsFor(user?.id, 3);
      console.log(data);
      setRequests(data);
    };
    fetchReqs();
  }, [user, decision]);

  return (
    <main className={styles.main}>
      <div className={styles.requests} onClick={() => setDec(!decision)}>
        {requests.map((req, idx) =>
          req.userOne ? (
            <MatchRequestCard key={idx} data={req} UserOne={req.userOne} />
          ) : null
        )}
      </div>
    </main>
  );
};

export default MatchRequestPage;
