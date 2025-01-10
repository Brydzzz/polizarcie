import Sidebar from "@/components/sidebars/dashboard-sidebar.component";

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
