import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export class Middleware {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const header = req.headers.authorization;

      // Verifica si el header "Authorization" está presente
      if (!header) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Extrae el token del header
      const token = header.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token is missing" });
      }

      // Verifica el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Almacena los datos decodificados en la solicitud
      //@ts-expect-error
      req["currentUser"] = decoded;

      next();
    } catch (error: any) {
      console.error(`Token verification error: ${error.message || error}`);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  // Requisito V: restringe endpoints a roles específicos (ej. revisar sesiones)
  static requireRole(...allowed: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      // @ts-expect-error currentUser lo setea verifyToken
      const roles: string[] = req["currentUser"]?.roles || [];
      if (!roles.some((r) => allowed.includes(r))) {
        return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
      }
      next();
    };
  }

  static async errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(`Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
}