import Searchbar from "@/components/inputs/searchbar.component";
import styles from "./page.module.scss";

const Test = () => {
  return (
    <main className={styles.container}>
      <h1>Jedzonko w okolicy</h1>
      <Searchbar id="search" placeholder="Co byś dziś przekąsił?" />
    </main>
  );
};

export default Test;
