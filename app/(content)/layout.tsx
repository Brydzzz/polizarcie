import MainHeader from "@/components/headers/main-header.component";
import { SessionProvider } from "next-auth/react";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <MainHeader />
      {children}
    </SessionProvider>
  );
}
