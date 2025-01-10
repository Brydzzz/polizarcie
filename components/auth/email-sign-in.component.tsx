"use client";

import {
  resetUserPassword,
  signInWithCredentials,
  signUpWithNodemailer,
} from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectSignInPageLoading,
  selectViewportWidth,
} from "@/lib/store/ui/ui.selector";
import {
  addSnackbar,
  setSignInPageLoading,
  ViewportSize,
} from "@/lib/store/ui/ui.slice";
import {
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/zod/users";
import { makeRequest, throwParsedZodError } from "@/utils/misc";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import Input from "../inputs/generic-input.component";
import { InputSize, InputStyle } from "../inputs/input.types";
import PasswordInput from "../inputs/password-input.component";
import Loader from "../misc/loader.component";
import styles from "./email-sign-in.module.scss";

const EmailSignIn = () => {
  const [mode, setMode] = useState<"sign-in" | "sign-up" | "reset-password">(
    "sign-in"
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepet, setPasswordRepet] = useState("");
  const loading = useAppSelector(selectSignInPageLoading);
  const dispatch = useAppDispatch();
  const session = useSession();
  const size = useAppSelector(selectViewportWidth);
  const [inputSize, setInputSize] = useState(InputSize.MEDIUM);
  const [buttonSize, setButtonSize] = useState(ButtonSize.LARGE);
  const searchParams = useSearchParams();

  useEffect(() => {
    dispatch(setSignInPageLoading(false));
  }, []);

  useEffect(() => {
    setInputSize(size < ViewportSize.SM ? InputSize.SMALL : InputSize.MEDIUM);
    setButtonSize(
      size < ViewportSize.SM ? ButtonSize.SMALL : ButtonSize.NORMAL
    );
  }, [size]);

  const trySignInWithCredentials = async (formData: FormData) => {
    dispatch(setSignInPageLoading(true));
    try {
      try {
        const data = await signInSchema.parseAsync({
          email: formData.get("email"),
          password: formData.get("password"),
        });
        await makeRequest(
          signInWithCredentials,
          [data, searchParams.get("callbackUrl") || undefined],
          undefined
        );
      } catch (error) {
        if (error instanceof ZodError) throwParsedZodError(error, dispatch);
        throw error;
      }
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("POLI_ERROR")) {
        const code = message.split(";")[1];
        switch (code) {
          case "401":
            dispatch(
              addSnackbar({ message: "Nieprawidłowe dane!", type: "error" })
            );
            break;
          default:
            dispatch(addSnackbar({ message: message, type: "error" }));
            break;
        }
      } else {
        if (message.startsWith("NEXT_REDIRECT")) await session.update();
        throw error;
      }
    }
    dispatch(setSignInPageLoading(false));
  };

  const trySignUpWithNodemailer = async (formData: FormData) => {
    dispatch(setSignInPageLoading(true));
    try {
      try {
        const data = await signUpSchema.parseAsync({
          email: formData.get("email"),
          name: formData.get("name"),
          password: formData.get("password"),
          passwordRepeat: formData.get("passwordRepeat"),
        });
        if (data.password !== data.passwordRepeat) {
          dispatch(
            addSnackbar({ message: "Hasła nie są takie same!", type: "error" })
          );
          throw new Error("POLI_ERROR;;");
        }
        await makeRequest(
          signUpWithNodemailer,
          [data, searchParams.get("callbackUrl") || undefined],
          dispatch
        );
      } catch (error) {
        if (error instanceof ZodError) throwParsedZodError(error, dispatch);
        throw error;
      }
    } catch (error) {
      const message = (error as Error).message;
      if (!message.startsWith("POLI_ERROR")) {
        if (message.startsWith("NEXT_REDIRECT")) await session.update();
        throw error;
      }
    }
    dispatch(setSignInPageLoading(false));
  };

  const tryResettingPassword = async (formData: FormData) => {
    dispatch(setSignInPageLoading(true));
    try {
      try {
        const data = await resetPasswordSchema.parseAsync({
          email: formData.get("email"),
          password: formData.get("password"),
          passwordRepeat: formData.get("passwordRepeat"),
        });
        if (data.password !== data.passwordRepeat)
          throw new Error("Passwords did not match!");
        await makeRequest(resetUserPassword, [data], undefined);
      } catch (error) {
        if (error instanceof ZodError) throwParsedZodError(error, dispatch);
        throw error;
      }
    } catch (error) {
      const message = (error as Error).message;
      if (!message.startsWith("POLI_ERROR")) {
        if (message.startsWith("NEXT_REDIRECT")) await session.update();
        throw error;
      }
    }
    dispatch(setSignInPageLoading(false));
  };

  return (
    <div className={styles.container}>
      {mode === "sign-up" ? (
        <form action={trySignUpWithNodemailer} className={styles.form}>
          <h2>Nowe konto</h2>
          <Input
            label="Adres email"
            name="email"
            type="email"
            style={InputStyle.HERO}
            size={inputSize}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Nazwa użytkownika"
            name="name"
            type="text"
            style={InputStyle.HERO}
            size={inputSize}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordInput
            label="Hasło"
            name="password"
            style={InputStyle.HERO}
            size={inputSize}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Powtórz hasło"
            name="passwordRepeat"
            style={InputStyle.HERO}
            size={inputSize}
            value={passwordRepet}
            onChange={(e) => setPasswordRepet(e.target.value)}
            required
          />

          <Button
            type="submit"
            style={ButtonStyle.SOLID}
            size={buttonSize}
            disabled={
              email && username && password && passwordRepet && !loading
                ? false
                : true
            }
          >
            {loading ? (
              <>
                Przetwarzanie <Loader size="16pt" />
              </>
            ) : (
              <>
                Zarejestruj się <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </Button>
        </form>
      ) : mode === "sign-in" ? (
        <form action={trySignInWithCredentials} className={styles.form}>
          <Input
            label="Adres email"
            type="email"
            name="email"
            style={InputStyle.HERO}
            size={inputSize}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {email && (
            <PasswordInput
              label="Hasło"
              name="password"
              style={InputStyle.HERO}
              size={inputSize}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          {email && (
            <Button
              type="submit"
              style={ButtonStyle.SOLID}
              size={buttonSize}
              disabled={email && password && !loading ? false : true}
            >
              {loading ? (
                <>
                  Przetwarzanie <Loader size="16pt" />
                </>
              ) : (
                <>
                  Zaloguj się <i className="fa-solid fa-arrow-right"></i>
                </>
              )}
            </Button>
          )}
        </form>
      ) : mode === "reset-password" ? (
        <form action={tryResettingPassword} className={styles.form}>
          <h2>Resetowanie hasła</h2>
          <Input
            label="Adres email"
            type="email"
            name="email"
            style={InputStyle.HERO}
            size={inputSize}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Nowe hasło"
            name="password"
            style={InputStyle.HERO}
            size={inputSize}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Powtórz hasło"
            name="passwordRepeat"
            style={InputStyle.HERO}
            size={inputSize}
            value={passwordRepet}
            onChange={(e) => setPasswordRepet(e.target.value)}
            required
          />
          <Button
            type="submit"
            style={ButtonStyle.SOLID}
            size={buttonSize}
            disabled={
              email && password && passwordRepet && !loading ? false : true
            }
          >
            {loading ? (
              <>
                Przetwarzanie <Loader size="16pt" />
              </>
            ) : (
              <>
                Wyślij link potwierdzający&nbsp;
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </Button>
        </form>
      ) : undefined}
      {mode === "sign-up" ? (
        <div className={styles.switch} onClick={() => setMode("sign-in")}>
          Masz już konto? <span className={styles.highlight}>Zaloguj się</span>
        </div>
      ) : mode === "sign-in" ? (
        <>
          {email && (
            <div
              className={styles.switch}
              onClick={() => setMode("reset-password")}
            >
              Zapomniałeś hasła?{" "}
              <span className={styles.highlight}>Zresetuj je</span>
            </div>
          )}

          <div className={styles.switch} onClick={() => setMode("sign-up")}>
            Nie masz konta? <span className={styles.highlight}>Załóż je</span>
          </div>
        </>
      ) : mode === "reset-password" ? (
        <div className={styles.switch} onClick={() => setMode("sign-in")}>
          Przypomniałeś sobie hasło?{" "}
          <span className={styles.highlight}>Zaloguj się</span>
        </div>
      ) : undefined}
    </div>
  );
};

export default EmailSignIn;
