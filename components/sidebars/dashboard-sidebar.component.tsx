"use client";

import styles from "./dashboard-sidebar.module.scss";

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h2>Panel ustawień</h2>
            <span
              className={styles.item}
              onClick={() => (window.location.href = `#`)}
            >
              <i className="fa-solid fa-user"></i>
              &nbsp; &nbsp; Podgląd
            </span>
            <span
              className={styles.item}
              onClick={() => (window.location.href = `#`)}
            >
              <i className="fa-solid fa-gear"></i>
              &nbsp; &nbsp; Profil
            </span>
            <span
              className={styles.item}
              onClick={() => (window.location.href = `#`)}
            >
              <i className="fa-solid fa-heart"></i>
              &nbsp; &nbsp; Ulubione
            </span>
            <span
              className={styles.item}
              onClick={() => (window.location.href = `#`)}
            >
              <i className="fa-solid fa-question"></i>
              &nbsp; &nbsp; Cos
            </span>
        </div>
    );
};

export default Sidebar;
