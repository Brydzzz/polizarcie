import { signIn } from "next-auth/react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize, ButtonStyle } from "../button/button.types";
import styles from "./login-needed.module.scss";

const LoginNeeded = () => {
  return (
    <div className={styles.container}>
      <div className={styles.message}>
        <p>Musisz być zalogowany by skorzystać z tej funkcji Poliżarcia</p>
      </div>
      <div className={styles.button}>
        <Button
          style={ButtonStyle.SOLID}
          color={ButtonColor.PRIMARY}
          size={ButtonSize.LARGE}
          onClick={() => signIn()}
        >
          Zaloguj się!
        </Button>
      </div>
    </div>
  );
};

export default LoginNeeded;
