"use client";

import styles from "./dashboard-sidebar.module.scss";

const Sidebar = () => {
    return (
        <div className={styles.sidebar}>
            <h2>Panel ustawień</h2>
            <span className={styles.item} onClick={() => (window.location.href = `#`)}>Podgląd</span>
            <span className={styles.item} onClick={() => (window.location.href = `#`)}>Profil</span>
            <span className={styles.item} onClick={() => (window.location.href = `#`)}>Ulubione restauracje</span>
            <span className={styles.item} onClick={() => (window.location.href = `#`)}>Cos</span>
        </div>
    );
};

export default Sidebar;
