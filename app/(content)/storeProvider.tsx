"use client";

import { getUserByEmail } from "@/lib/db/users";
import { AppStore, makeStore } from "@/lib/store/store";
import {
  setCurrentUser,
  setCurrentUserLoading,
} from "@/lib/store/user/user.slice";
import { transferWithJSON } from "@/utils/misc.client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { Persistor, persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

type Props = {
  children: React.ReactNode;
};

const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore>();
  const persistorRef = useRef<Persistor>();
  if (!storeRef.current || !persistorRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }
  const session = useSession();

  useEffect(() => {
    const exec = async () => {
      storeRef.current?.dispatch(setCurrentUserLoading(true));
      storeRef.current?.dispatch(setCurrentUser(undefined));
      if (session.status === "loading") {
        return;
      }
      if (session.data?.user?.email) {
        const result = await transferWithJSON(getUserByEmail, [
          session.data.user.email,
        ]);
        storeRef.current?.dispatch(setCurrentUser(result || undefined));
      }
      storeRef.current?.dispatch(setCurrentUserLoading(false));
    };
    exec();
  }, [session]);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
