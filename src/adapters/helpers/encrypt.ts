import * as bcrypt from "bcrypt";

export class Ecrypt {
  // Requisito 3: min 8, una mayúscula, sin espacios, un signo
  static validatePassword(password: string): boolean {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNoSpaces = !/\s/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-]/.test(password);

    return hasMinLength && hasUpperCase && hasNoSpaces && hasSpecialChar;
  }

  static async passwordEncrypt(password: string): Promise<string> {
    if (!this.validatePassword(password)) {
      throw new Error(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un signo y no contener espacios."
      );
    }
    return bcrypt.hash(password, 10);
  }

  static async comparePass(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
