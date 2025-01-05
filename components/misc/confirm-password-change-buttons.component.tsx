"use client";

import { cancelPasswordChange, confirmPasswordChange } from "@/lib/db/users";
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
import { makeRequest } from "@/utils/misc";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize, ButtonStyle } from "../button/button.types";

const ConfirmPasswordChangeButtons = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectSignInPageLoading);
  const size = useAppSelector(selectViewportWidth);

  useEffect(() => {
    dispatch(setSignInPageLoading(false));
  }, []);

  const confirm = async () => {
    dispatch(setSignInPageLoading(true));
    try {
      const result = await makeRequest(confirmPasswordChange, [], dispatch);
      if (!result)
        throw new Error("Wystąpił błąd, spróbuj zresetować hasło od nowa");
      dispatch(addSnackbar({ message: "Hasło zresetowane", type: "success" }));
      redirect("/browse");
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("NEXT_REDIRECT")) throw error;
      dispatch(addSnackbar({ message: message, type: "error" }));
    }
    dispatch(setSignInPageLoading(false));
  };

  const cancel = async () => {
    dispatch(setSignInPageLoading(true));
    try {
      await makeRequest(cancelPasswordChange, [], dispatch);
      dispatch(addSnackbar({ message: "Anulowano zmianę", type: "success" }));
      redirect("/browse");
    } catch (error) {
      const message = (error as Error).message;
      if (message.startsWith("NEXT_REDIRECT")) throw error;
      dispatch(addSnackbar({ message: message, type: "error" }));
    }
    dispatch(setSignInPageLoading(false));
  };

  return (
    <>
      <Button
        onClick={cancel}
        style={ButtonStyle.OUTLINE}
        color={ButtonColor.SECONDARY}
        size={size < ViewportSize.XS ? ButtonSize.SMALL : ButtonSize.NORMAL}
        disabled={loading}
      >
        Anuluj zmianę
      </Button>

      <Button
        onClick={confirm}
        disabled={loading}
        size={size < ViewportSize.XS ? ButtonSize.SMALL : ButtonSize.NORMAL}
      >
        Potwierdzam zmianę
      </Button>
    </>
  );
};

export default ConfirmPasswordChangeButtons;
