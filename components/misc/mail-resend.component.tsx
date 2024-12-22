"use client";

import { sendVerificationMail } from "@/lib/auth";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectSignInPageLoading } from "@/lib/store/ui/ui.selector";
import { addSnackbar, setSignInPageLoading } from "@/lib/store/ui/ui.slice";
import { useEffect } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize, ButtonStyle } from "../button/button.types";
import Loader from "./loader.component";

type Props = {
  userId: string;
};

const MailResend = ({ userId }: Props) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectSignInPageLoading);

  useEffect(() => {
    dispatch(setSignInPageLoading(false));
    sendMail(true);
  }, []);

  const sendMail = async (force?: boolean) => {
    if (!force && loading) return;
    dispatch(setSignInPageLoading(true));
    try {
      const err = await sendVerificationMail(userId);
      if (err) throw new Error(err.error);
      dispatch(addSnackbar({ message: "Wysłano maila", type: "success" }));
    } catch (error) {
      dispatch(
        addSnackbar({ message: (error as Error).message, type: "error" })
      );
    }
    dispatch(setSignInPageLoading(false));
  };

  return (
    <Button
      style={ButtonStyle.OUTLINE}
      color={ButtonColor.SECONDARY}
      size={ButtonSize.SMALL}
      onClick={sendMail}
      disabled={loading}
    >
      {loading ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          Wysyłam maila...&nbsp;
          <Loader size="16pt" />
        </div>
      ) : (
        "Wyślij ponownie"
      )}
    </Button>
  );
};

export default MailResend;
