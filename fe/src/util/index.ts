import { ValidEmail } from "../types/index";
/**
 * Converts email to nominal ValidEmail
 */
export function toValidEmail(email: string) {
  return email as ValidEmail;
}

export function isEmailValid(email: string): boolean {
  // NOTE: validation is "fake"
  const [h, t] = email.split("@");

  return Boolean(h) && Boolean(t);
}
