import Link from "next/link";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  return (
    <>
      <header className={styles.container}>
        <Link href={"/"}>
          <h1>Poliżarcie</h1>
        </Link>
        <div className={styles.buttons}>
          <span className={styles.profile}>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </header>
      <div className={styles.placeholder}></div>
    </>
  );
};

export default MainHeader;
