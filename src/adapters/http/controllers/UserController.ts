import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserService } from "../../../core/services/userService";
import { User } from "../../../core/entity/User";
import { Ecrypt } from "../../helpers/encrypt";
import { SessionController } from "./SessionController";

const MAX_FAILED_ATTEMPTS = 3;

export class UserController {
  constructor(private userService: UserService,
    private sessionController: SessionController
  ) {}

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getUsers();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  }

  async getUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }

  async login(req: Request, res: Response) {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "identifier y password son obligatorios" });
    }

    try {
      const user = await this.userService.getUserByIdentifier(identifier);

      if (!user || user.isDeleted) {
        return res.status(404).json({ message: "User not found" });
      }

      // Requisito IV: usuario bloqueado tras 3 intentos fallidos
      if (user.status === "blocked") {
        return res.status(403).json({ message: "Usuario bloqueado por múltiples intentos fallidos" });
      }

      const isPasswordValid = await this.userService.verifyPassword(password, user.password);

      if (!isPasswordValid) {
        user.failedAttempts += 1;

        if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
          user.status = "blocked";
          await this.userService.updateUser(user.idUsuario.toString(), user);
          return res.status(403).json({ message: "Usuario bloqueado por múltiples intentos fallidos" });
        }

        await this.userService.updateUser(user.idUsuario.toString(), user);
        return res.status(401).json({
          message: "Contraseña incorrecta",
          intentosRestantes: MAX_FAILED_ATTEMPTS - user.failedAttempts,
        });
      }

      // Requisito I: solo una sesión activa a la vez
      if (user.sessionActive === "A") {
        return res.status(409).json({ message: "El usuario ya tiene una sesión activa" });
      }

      user.failedAttempts = 0;
      user.sessionActive = "A";
      await this.userService.updateUser(user.idUsuario.toString(), user);

      // Requisito II: se registra el inicio de sesión
      const session = await this.sessionController.createSessionForLogin(user.idUsuario);

      const roles = (user.roles || []).map((ru) => ru.role?.rolName).filter(Boolean);
      const token = jwt.sign(
        { id: user.idUsuario, roles },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "8h" }
      );

      const { password: _omit, ...userSafe } = user;
      return res.status(200).json({ message: "Login successful", token, user: userSafe, session });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || String(error) });
    }
  }
  async logout(req: Request, res: Response) {
    const { userId } = req.body;
  
    try {
      const user = await this.userService.getUser(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.sessionActive === "I") {
        return res.status(400).json({ message: "No active session for this user" });
      }
  
      // Actualizar el estado de la sesión del usuario
      user.sessionActive = "I"; // Cambiar a inactivo
      await this.userService.updateUser(user.idUsuario.toString(), user);
  
      // Cerrar la sesión activa del usuario
      const sessionClosed = await this.sessionController.closeSessionForLogout(user.idUsuario);
      if (!sessionClosed) {
        return res.status(400).json({ message: "No active session to close" });
      }
  
      return res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || String(error) });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.body as User;
  
    try {
      const updatedUser = await this.userService.updateUser(id, user);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: error});
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
  
    try {
      const user = await this.userService.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Realizar eliminación lógica
      user.isDeleted = true;
      await this.userService.updateUser(id, user);
  
      return res.status(200).json({ message: "User deleted logically" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  }
}