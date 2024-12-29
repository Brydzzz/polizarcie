"use client";
import ContactCard from "@/components/cards/contact-card.component.tsx";
import MatchRequestCard from "@/components/cards/match-request.component";
import LoaderBlur from "@/components/misc/loader-blur.component";
import LoginNeeded from "@/components/misc/login-needed.component";
import { getPendingRequestsFor } from "@/lib/db/matches";
import { getUsersMatchedWith } from "@/lib/db/users";
import { useAppSelector } from "@/lib/store/hooks";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import { Match, User, UserMedia } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
const MatchRequestPage = () => {
  const [decision, setDec] = useState<boolean>(false);
  const [requests, setRequests] = useState<
    Array<Partial<Match & { userOne: Partial<User> }>>
  >([]);
  const [contacts, setContacts] = useState<
    Array<Partial<User & { medias: Partial<UserMedia>[] }>>
  >([]);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  useEffect(() => {
    const fetchReqs = async () => {
      if (!user) return;
      const data = await getPendingRequestsFor(user?.id, 3);
      setRequests(data);
    };
    fetchReqs();
  }, [user, decision]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      const data = await getUsersMatchedWith(user.id);
      console.log(data);
      setContacts(data);
    };
    fetchMatches();
    console.log(contacts);
  }, [user, decision]);

  return loading ? (
    <LoaderBlur />
  ) : user ? (
    <main className={styles.main}>
      <div className={styles.prompt}>
        <p>Zainteresowani wspólnym pożeraniem: </p>
      </div>
      <div className={styles.requests} onClick={() => setDec(!decision)}>
        {requests.map((req, idx) =>
          req.userOne ? (
            <div className={styles.request} key={idx}>
              <MatchRequestCard data={req} UserOne={req.userOne} />
            </div>
          ) : null
        )}
      </div>
      <div className={styles.prompt}>
        <p>Kontakty: </p>
      </div>
      <div className={styles.contacts}>
        {contacts.map((cont, idx) =>
          cont.medias ? (
            <div className={styles.contact} key={idx}>
              <ContactCard data={cont} medias={cont.medias} />
            </div>
          ) : (
            <div className={styles.contact} key={idx}>
              <ContactCard data={cont} medias={[]} />
            </div>
          )
        )}
      </div>
    </main>
  ) : (
    <main className={styles.mainlog}>
      <div className={styles.login}>
        <LoginNeeded />
      </div>
    </main>
  );
};

export default MatchRequestPage;
