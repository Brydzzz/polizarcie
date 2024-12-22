import MailResend from "@/components/misc/mail-resend.component";
import { getUserById } from "@/lib/db/users";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const VerifyPage = async ({ params }: Props) => {
  const { slug: id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();
  return (
    <div className={styles.container}>
      <h2>
        Ostatni krok!
        <br />
        Wysłaliśmy na Twój adres e-mail link weryfikacyjny,
      </h2>
      <h1>Proszę potwierdź swoje konto.</h1>
      <div>
        Nie dostałeś maila? <MailResend userId={user.id} />
      </div>
    </div>
  );
};

export default VerifyPage;
