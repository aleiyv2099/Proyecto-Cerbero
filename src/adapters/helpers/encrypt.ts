import * as dotenv from "dotenv";

dotenv.config();

const { JWT_SECRET = "" } = process.env;

interface Payload {
  id: string;
}

export class Ecrypt {
  static validatePassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNoSpaces = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasMinLength && hasUpperCase && hasNoSpaces && hasSpecialChar;
  }

  static async passwordEncrypt(password: string) {
    if (!this.validatePassword(password)) {
      throw new Error("La contraseña no cumple con los requisitos de seguridad.");
    }
    return password;
  }

  static async comparePass(password: string, hash: string) {
    return password === hash;
  }
}
