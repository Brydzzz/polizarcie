"use client";

import { useState } from "react";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import Input from "../inputs/generic-input.component";
import { InputSize, InputStyle } from "../inputs/input.types";
import PasswordInput from "../inputs/password-input.component";
import styles from "./email-sign-in.module.scss";

const EmailSignIn = () => {
  const [signInUp, setSignInUp] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepet, setPasswordRepet] = useState("");

  return (
    <div className={styles.container}>
      {signInUp ? (
        <form action="#" className={styles.form}>
          <h2>Nowe konto</h2>
          <Input
            label="Adres email"
            type="email"
            style={InputStyle.HERO}
            size={InputSize.MEDIUM}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Nazwa użytkownika"
            type="text"
            style={InputStyle.HERO}
            size={InputSize.MEDIUM}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordInput
            label="Hasło"
            style={InputStyle.HERO}
            size={InputSize.MEDIUM}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Powtórz hasło"
            style={InputStyle.HERO}
            size={InputSize.MEDIUM}
            value={passwordRepet}
            onChange={(e) => setPasswordRepet(e.target.value)}
            required
          />
          {email && password && passwordRepet && (
            <Button
              type="submit"
              style={ButtonStyle.SOLID}
              size={ButtonSize.NORMAL}
            >
              Zarejestruj się <i className="fa-solid fa-arrow-right"></i>
            </Button>
          )}
        </form>
      ) : (
        <form action="#" className={styles.form}>
          <Input
            label="Adres email"
            type="email"
            style={InputStyle.HERO}
            size={InputSize.MEDIUM}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && (
            <PasswordInput
              label="Hasło"
              style={InputStyle.HERO}
              size={InputSize.MEDIUM}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          {email && password && (
            <Button
              type="submit"
              style={ButtonStyle.SOLID}
              size={ButtonSize.NORMAL}
            >
              Zaloguj się <i className="fa-solid fa-arrow-right"></i>
            </Button>
          )}
        </form>
      )}
      {signInUp ? (
        <div className={styles.switch} onClick={() => setSignInUp(false)}>
          Masz już konto? <span className={styles.highlight}>Zaloguj się</span>
        </div>
      ) : (
        <div className={styles.switch} onClick={() => setSignInUp(true)}>
          Nie masz konta? <span className={styles.highlight}>Załóż je</span>
        </div>
      )}
    </div>
  );
};

export default EmailSignIn;
