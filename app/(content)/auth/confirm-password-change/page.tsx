import ConfirmPasswordChangeButtons from "@/components/misc/confirm-password-change-buttons.component";
import { getUserPasswordHashCache } from "@/lib/db/users.server-only";
import { getCurrentUser } from "@/utils/users";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

const ConfirmPasswordChangePage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) notFound();
  const passwordHashCache = await getUserPasswordHashCache(currentUser.id);
  if (!passwordHashCache) notFound();

  return (
    <div className={styles.container}>
      <h2>Otrzymaliśmy prośbę o zmianę twojego hasła,</h2>
      <h1>Potwierdź zmianę hasła</h1>
      <p>Jeżeli to nie Ty wysłałeś prośbę po prostu anuluj zmianę</p>
      <div>
        <ConfirmPasswordChangeButtons />
      </div>
    </div>
  );
};

export default ConfirmPasswordChangePage;
