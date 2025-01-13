import styles from "./layout.module.scss";

const AdminDashboardLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className={styles.container}>{children}</div>;
};

export default AdminDashboardLayout;
