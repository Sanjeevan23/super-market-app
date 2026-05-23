export type PasswordErrorCode =
  | ''
  | 'PWD_FIRST_CHAR_LETTER'
  | 'PWD_FIRST_CAPITAL'
  | 'PWD_TOO_SHORT'
  | 'PWD_NO_NUMBER'
  | 'PWD_NO_SYMBOL';

export const validatePasswordLive = (pwd: string): PasswordErrorCode => {
  if (!pwd) return '';
  if (!/^[A-Za-z]/.test(pwd)) return 'PWD_FIRST_CHAR_LETTER';
  if (!/^[A-Z]/.test(pwd[0])) return 'PWD_FIRST_CAPITAL';
  if (pwd.length < 5) return 'PWD_TOO_SHORT';
  if (!/\d/.test(pwd)) return 'PWD_NO_NUMBER';
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\];'`~+=\/]/.test(pwd)) {
    return 'PWD_NO_SYMBOL';
  }
  return '';
};
