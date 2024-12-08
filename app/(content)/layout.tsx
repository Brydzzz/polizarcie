import MainHeader from "@/components/headers/main-header.component";
import Snackbars from "@/components/snackbars/snackbars-container.component";
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
      <Snackbars />
    </Providers>
  );
}
