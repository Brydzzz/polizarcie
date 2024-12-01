import MainHeader from "@/components/headers/main-header.component";
import Providers from "./providers";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <MainHeader />
      {children}
    </Providers>
  );
}
