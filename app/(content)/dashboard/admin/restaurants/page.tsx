import RestaurantForm from "@/components/forms/restaurant-form.component";
import { hasPermission } from "@/lib/permissions";
import { getCurrentUser } from "@/utils/users";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";

const RestaurantManagerPage = async () => {
  const currentUser = (await getCurrentUser()) || undefined;
  if (!hasPermission(currentUser, "ui", "adminDashboard"))
    redirect("/auth/sign-in");
  return <div className={styles.container}>{<RestaurantForm />}</div>;
};

export default RestaurantManagerPage;
