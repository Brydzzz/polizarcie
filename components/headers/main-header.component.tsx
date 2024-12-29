import Link from "next/link";
import MatchDropdown from "../dropdowns/match-dropdown.component";
import UserDropdown from "../dropdowns/user-dropdown.component";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  return (
    <>
      <header className={styles.container}>
        <Link href={"/"} className={styles.title}>
          <h1>Poliżarcie</h1>
        </Link>
        <div className={styles.options}>
          <div className={styles.option}>
            <Link href={"/browse/"}>
              <h2>Przeglądaj</h2>
            </Link>
          </div>
          <div className={styles.option}>
            <Link href={"/map/"}>
              <h2>Mapka</h2>
            </Link>
          </div>
          <div className={styles.option}>
            <MatchDropdown />
          </div>
        </div>
        <div className={styles.buttons}>
          <UserDropdown />
        </div>
      </header>
      <div className={styles.placeholder}></div>
    </>
  );
};

export default MainHeader;
