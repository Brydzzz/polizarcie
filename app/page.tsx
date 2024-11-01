import { prisma } from "@/utils/prisma";
import Image from "next/image";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const users = await prisma.user.findMany();
  console.log(users);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>
          Database connection and migration test:
          <br />
          Found users:
          {users.map((user) => (
            <h2 key={user.id}>{user.name}</h2>
          ))}
        </div>
      </main>
    </div>
  );
}
