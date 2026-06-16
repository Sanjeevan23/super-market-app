import translations from "../assets/translation.json";
import { PasswordErrorCode } from "./passwordValidator";

type Lang = keyof typeof translations;

export const pwdErrorMessage = (
  code: PasswordErrorCode,
  lang: Lang = "en"
): string => {
  if (!code) return "";
  return translations[lang][code as keyof (typeof translations)[Lang]] ?? code;
};
