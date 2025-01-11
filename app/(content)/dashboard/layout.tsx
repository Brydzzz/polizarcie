import DashboardSidebar from "@/components/sidebars/dashboard-sidebar.component";
import { getCurrentUser } from "@/utils/users";
import { redirect } from "next/navigation";
import styles from "./layout.module.scss";

const DashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/auth/sign-in");
  return (
    <>
      <div className={styles.container}>
        <DashboardSidebar />
        <div className={styles.scrollable}>{children}</div>
      </div>
    </>
  );
};

export default DashboardLayout;
