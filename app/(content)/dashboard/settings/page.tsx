import UserSettingsForm from "@/components/forms/user-settings.component";
import styles from "./page.module.scss";

import { getCurrentUser } from "@/utils/users";
import { redirect } from "next/navigation";

const UserSettings = async () => {
  const currentUser = (await getCurrentUser()) || undefined;
  if (!currentUser) redirect("/auth/sign-in");

  return (
    <div className={styles.container}>
      <UserSettingsForm user={currentUser} />
    </div>
  );
};

export default UserSettings;
