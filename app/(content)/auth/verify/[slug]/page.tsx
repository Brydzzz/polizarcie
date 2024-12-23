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
  const { slug } = await params;
  const parts = slug.split("-");
  const id = parts.at(0) || "";
  const modeRaw = parts.at(1);
  const mode: "verify" | "reset" =
    modeRaw && (modeRaw === "verify" || modeRaw === "reset")
      ? modeRaw
      : "verify";
  const user = await getUserById(id);
  if (!user) notFound();
  return (
    <div className={styles.container}>
      <h2>
        Ostatni krok!
        <br />
        Wysłaliśmy na Twój adres e-mail link weryfikacyjny,
      </h2>
      <h1>
        {mode === "verify"
          ? "Proszę potwierdź swoje konto."
          : "Proszę potwierdź, że to Ty"}
      </h1>
      <div>
        Nie dostałeś maila? <MailResend userId={user.id} mode={mode} />
      </div>
    </div>
  );
};

export default VerifyPage;
