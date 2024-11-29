import Link from "next/link";
import UserDropdown from "../dropdowns/user-dropdown.component";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  return (
    <>
      <header className={styles.container}>
        <Link href={"/"} className={styles.title}>
          <h1>Poliżarcie</h1>
        </Link>
        <div className={styles.buttons}>
          <UserDropdown />
        </div>
      </header>
      <div className={styles.placeholder}></div>
    </>
  );
};

export default MainHeader;
