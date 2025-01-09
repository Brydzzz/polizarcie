"use client";
import ContactCard from "@/components/cards/contact-card.component";
import MatchRequestCard from "@/components/cards/match-request.component";
import OurPendingCard from "@/components/cards/our-pending-card.component";
import LoaderBlur from "@/components/misc/loader-blur.component";
import LoginNeeded from "@/components/misc/login-needed.component";
import { denyMatch, getPendingRequestsFor } from "@/lib/db/matches";
import { getUsersMatchedWith, getUsersPendingWith } from "@/lib/db/users";
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
  const [pendings, setPendings] = useState<Partial<User[]>>([]);
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  useEffect(() => {
    const fetchReqs = async () => {
      if (!user) return;
      const data = await getPendingRequestsFor(user?.id, 5);
      setRequests(data);
    };
    fetchReqs();
  }, [user, decision]);

  useEffect(() => {
    const fetchReqs = async () => {
      if (!user) return;
      const data = await getUsersPendingWith(user?.id);
      setPendings(data);
    };
    fetchReqs();
  }, [user]);
  const handleMore = (id: string | undefined) => {
    if (!user) return;
    if (!id) return;
    denyMatch(user.id, id);
  };
  const handleDecision = (val: boolean) => {
    setDec(!decision);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      const data = await getUsersMatchedWith(user.id);
      console.log(data);
      setContacts(data);
    };
    fetchMatches();
  }, [user, decision]);

  return loading ? (
    <LoaderBlur />
  ) : user ? (
    <main className={styles.main}>
      <div className={styles.header}>
        <div className={styles.prompt}>
          <p>Zainteresowani wspólnym pożeraniem: </p>
        </div>
      </div>
      <div className={styles.requests} onClick={() => setDec(!decision)}>
        {requests.map((req, idx) =>
          req.userOne ? (
            <div className={styles.request} key={idx}>
              <MatchRequestCard
                data={req}
                UserOne={req.userOne}
                onClickDecision={() => handleDecision(!decision)}
              />
            </div>
          ) : null
        )}
      </div>
      <div className={styles.bottom}>
        <div className={styles.contacts}>
          <div className={styles.prompt}>
            <p>Kontakty: </p>
          </div>
          {contacts.length >= 1 ? (
            <div className={styles.contactsList}>
              {contacts.map((cont, idx) =>
                cont.medias ? (
                  <div className={styles.contact} key={idx}>
                    <ContactCard
                      data={cont}
                      medias={cont.medias}
                      onClickDelete={() => handleMore(cont.id)}
                    />
                  </div>
                ) : (
                  <div className={styles.contact} key={idx}>
                    <ContactCard
                      data={cont}
                      medias={[]}
                      onClickDelete={() => handleMore(cont.id)}
                    />
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>
        <div className={styles.pendings}>
          <div className={styles.prompt}>
            <p>Oczekujące: </p>
          </div>
          {pendings.length >= 1 ? (
            <div className={styles.pendingList}>
              {pendings.map((pend, idx) => (
                <div className={styles.pend} key={idx}>
                  {pend ? <OurPendingCard data={pend} /> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
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
