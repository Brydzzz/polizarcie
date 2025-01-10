"use client";

import SearchSection from "@/components/sections/search-section.component";
import styles from "./page.module.scss";

const SearchPage = () => {
  return (
    <div className={styles.container}>
      <SearchSection cardsOrigin="browse"/>
    </div>
  );
};

export default SearchPage;
