import MainHeader from "@/components/headers/main-header.component";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}
