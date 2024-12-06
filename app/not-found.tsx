import styles from "./not-found.module.scss";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <h1>404</h1>&nbsp;– niestety nie mogliśmy odnaleźć tej strony
    </div>
  );
};

export default NotFound;
