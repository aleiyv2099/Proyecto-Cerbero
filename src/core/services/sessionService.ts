import { Session } from "../entity/Session";
import { SessionRepositoryPort } from "../ports/SessionRepositoryPort";

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepositoryPort) {}

  async getSessions(): Promise<Session[]> {
    return await this.sessionRepository.findAll();
  }

  async createSession(session: Session): Promise<Session> {
    return await this.sessionRepository.createSession(session);
  }

  async updateSession(id: number, session: Session): Promise<Session> {
    return await this.sessionRepository.updateSession(id, session);
  }

  async deleteSession(id: number): Promise<boolean> {
    return await this.sessionRepository.deleteSession(id);
  }

  async getSession(id: number): Promise<Session | null> {
    const session = await this.sessionRepository.findById(id);
    if (session && session.isDeleted) {
      return null; // Retornar null si la sesión está eliminada
    }
    return session;
  }

  async getSessionsByUserId(userId: number): Promise<Session[]> {
    return await this.sessionRepository.findByUserId(userId);
  }
  async getActiveSessionByUserId(userId: number): Promise<Session | null> {
    return await this.sessionRepository.findActiveSessionByUserId(userId);
  }

  async getLoginHistory(userId: number): Promise<any[]> {
    return await this.sessionRepository.getLoginHistory(userId);
  }
}