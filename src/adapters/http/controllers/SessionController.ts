import { Request, Response } from "express";
import { SessionService } from "../../../core/services/sessionService";
import { Session } from "../../../core/entity/Session";

export class SessionController {
  constructor(private sessionService: SessionService) {}

  async getAllSessions(req: Request, res: Response) {
    const sessions = await this.sessionService.getSessions();
    if (!sessions) {
      return res.status(404).json({ message: "No sessions found" });
    }
    return res.status(200).json(sessions);
  }

  async getSession(req: Request, res: Response) {
    const { id } = req.params;
    const session = await this.sessionService.getSession(Number(id));
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    return res.status(200).json(session);
  }

  // Requisito V: registro de inicios de sesión de un usuario (solo rol autorizado)
  async getUserLoginHistory(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const history = await this.sessionService.getLoginHistory(Number(userId));
      return res.status(200).json(history);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || String(error) });
    }
  }

  async createSessionForLogin(userId: number): Promise<Session> {
    // Crear una nueva sesión al iniciar sesión
    const newSession = await this.sessionService.createSession({
      fechaIngreso: new Date(),
      user: { idUsuario: userId } as any, // Vincular al usuario
    } as Session);
    return newSession;
  }

  async closeSessionForLogout(userId: number): Promise<boolean> {
    // Cerrar la sesión activa del usuario al cerrar sesión
    const activeSession = await this.sessionService.getActiveSessionByUserId(userId);
    if (!activeSession) {
      return false; // No hay sesión activa
    }

    activeSession.fechaCierre = new Date(); // Registrar la fecha de cierre
    await this.sessionService.updateSession(activeSession.id, activeSession);
    return true;
  }
}