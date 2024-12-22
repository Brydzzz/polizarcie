import { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const providers: Provider[] = [Google, GitHub];

export const authConfig = {
  providers: providers,
} satisfies NextAuthConfig;

export function verificationMailHTML(params: { url: string }) {
  const { url } = params;
  const color = {
    background: "#2e1f27",
    brand: "#f5853f",
    text: "#fffcf9",
  };

  return `
<body>
  <div style="width: 100%; background-color: ${color.background}; display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center; color: ${color.text};  border-radius: 30px;">
    <h1 style="font-weight: normal; text-align: center">Dokończ swoją rejestrację w <br/><strong>Poliżarciu</strong></h1>
    <a href="${url}"
      target="_blank"
      style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; background-color: ${color.brand}; color: ${color.text}; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;"
    >
      Potwierdź swój adres e-mail
    </a>
    <p style="text-align: center">
      Jeżeli nie zakładałeś u nas konta, zignoruj tą wiadomość.
    </p>
  </div>
</body>
`;
}
