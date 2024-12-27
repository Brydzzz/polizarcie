import styles from "./loader-blur.module.scss";
import Loader from "./loader.component";

const LoaderBlur = () => {
  return (
    <div className={styles.container}>
      <Loader size="75px" />
    </div>
  );
};

export default LoaderBlur;
