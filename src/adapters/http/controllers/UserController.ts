import { Request, Response } from "express";
import { UserService } from "../../../core/services/userService";
import { User } from "../../../core/entity/User";
import { Ecrypt } from "../../helpers/encrypt";
import { SessionController } from "./SessionController";

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
  
    try {
      const user = await this.userService.getUserByIdentifier(identifier);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.status === "blocked") {
        return res.status(403).json({ message: "User is blocked due to multiple failed login attempts" });
      }
  
      // Si el usuario está en estado inactivo (I), permitir el inicio de sesión y cambiar a activo (A)
      if (user.sessionActive === "I") {
        const isPasswordValid = await this.userService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid password" });
        }
  
        user.sessionActive = "A"; // Cambiar a activo
        user.failedAttempts = 0; // Reiniciar intentos fallidos
        await this.userService.updateUser(user.idUsuario.toString(), user);
  
        // Crear una nueva sesión para el usuario
        const session = await this.sessionController.createSessionForLogin(user.idUsuario);
  
        return res.status(200).json({ message: "Login successful", user, session });
      }
  
      // Si el usuario ya tiene una sesión activa
      if (user.sessionActive === "A") {
        return res.status(400).json({ message: "User already has an active session" });
      }
  
      // Validar la contraseña
      const isPasswordValid = await this.userService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        user.failedAttempts += 1;
  
        if (user.failedAttempts >= 3) {
          user.status = "blocked";
          await this.userService.updateUser(user.idUsuario.toString(), user);
          return res.status(403).json({ message: "User is blocked due to multiple failed login attempts" });
        }
  
        await this.userService.updateUser(user.idUsuario.toString(), user);
        return res.status(401).json({ message: "Invalid password" });
      }
  
      user.failedAttempts = 0;
      user.sessionActive = "A"; // Cambiar a activo
      await this.userService.updateUser(user.idUsuario.toString(), user);
  
      // Crear una nueva sesión para el usuario
      const session = await this.sessionController.createSessionForLogin(user.idUsuario);
  
      return res.status(200).json({ message: "Login successful", user, session });
    } catch (error) {
      return res.status(500).json({ message: error });
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
    } catch (error) {
      return res.status(500).json({ message: Error });
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