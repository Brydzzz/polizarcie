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

type Props = {
  children: React.ReactNode;
};

const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
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

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
