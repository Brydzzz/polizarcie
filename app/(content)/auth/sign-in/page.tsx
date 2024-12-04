import { providerMap } from "@/auth";
import EmailSignIn from "@/components/auth/email-sign-in.component";
import ProviderButton from "@/components/auth/provider-button.component";
import { getCurrentUser } from "@/utils/users";
import { redirect } from "next/navigation";
import styles from "./page.module.scss";

const SignIn = async () => {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Zaloguj się</h1>
        <div className={styles.hole}>
          <EmailSignIn />
          Lub zaloguj się przy pomocy:
          <div className={styles.providers}>
            {Object.values(providerMap).map((provider) => (
              <ProviderButton key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
