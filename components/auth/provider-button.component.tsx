"use client";

import { signIn } from "next-auth/react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize, ButtonStyle } from "../button/button.types";

type Props = {
  provider: { id: string; name: string };
};

const ProviderButton = ({ provider }: Props) => {
  return (
    <Button
      onClick={() =>
        signIn(provider.id, {
          redirect: true,
          redirectTo: "/browse",
        })
      }
      color={ButtonColor.TEXT}
      style={ButtonStyle.SOLID}
      size={ButtonSize.NORMAL}
    >
      <span
        style={{
          color: `var(--${provider.name.toLowerCase()}-color)`,
          fontWeight: "bold",
        }}
      >
        <i className={`fa-brands fa-${provider.name.toLowerCase()}`}></i>
        &nbsp;
        {provider.name}
      </span>
    </Button>
  );
};

export default ProviderButton;
