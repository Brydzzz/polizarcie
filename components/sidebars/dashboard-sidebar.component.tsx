"use client";

import styles from "./dashboard-sidebar.module.scss";


const isActive = (path: string) => window.location.pathname.endsWith(path);

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h2>Panel ustawień</h2>
            <span
              className={`${styles.item} ${isActive('/myprofile') ? styles.active : ''}`}
              onClick={() => (window.location.href = `/dashboard/myprofile`)}
            >
              <i className="fa-solid fa-user"></i>
              &nbsp; &nbsp; Podgląd
            </span>
            <span
              className={`${styles.item} ${isActive('/dashboard/settings') ? styles.active : ''}`}
              onClick={() => (window.location.href = `/dashboard/settings`)}
            >
              <i className="fa-solid fa-gear"></i>
              &nbsp; &nbsp; Profil
            </span>
            <span
              className={`${styles.item} ${isActive('/favorite') ? styles.active : ''}`}
              onClick={() => (window.location.href = `/dashboard/favorite`)}
            >
              <i className="fa-solid fa-heart"></i>
              &nbsp; &nbsp; Ulubione
            </span>
        </div>
    );
};

export default Sidebar;
