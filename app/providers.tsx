"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from "./storeProvider";

type Props = {
  children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  );
};

export default Providers;
