import { Session } from "../../core/entity/Session";
import { SessionRepositoryPort } from "../../core/ports/SessionRepositoryPort";
import { AppDataSource } from "../database/data-source";

export class TypeOrmSessionRepositoryPort implements SessionRepositoryPort {
  private sessionRepository = AppDataSource.getRepository(Session);

  async findAll(): Promise<Session[]> {
    return await this.sessionRepository.find({ relations: ["user"] });
  }

  async findById(id: number): Promise<Session | null> {
    return await this.sessionRepository.findOne({ where: { id }, relations: ["user"] });
  }

  async findByUserId(userId: number): Promise<Session[]> {
    return await this.sessionRepository.find({ where: { user: { idUsuario: userId } }, relations: ["user"] });
  }

  async createSession(session: Session): Promise<Session> {
    const newSession = this.sessionRepository.create(session);
    return await this.sessionRepository.save(newSession);
  }

  async updateSession(id: number, session: Session): Promise<Session> {
    const sessionToUpdate = await this.sessionRepository.findOne({ where: { id } });
    if (!sessionToUpdate) {
      throw new Error("Session not found");
    }

    Object.assign(sessionToUpdate, session);
    return await this.sessionRepository.save(sessionToUpdate);
  }

  async deleteSession(id: number): Promise<boolean> {
    const sessionToDelete = await this.sessionRepository.findOne({ where: { id } });
    if (!sessionToDelete) {
      throw new Error("Session not found");
    }

    await this.sessionRepository.remove(sessionToDelete);
    return true;
  }
  async findActiveSessionByUserId(userId: number): Promise<Session | null> {
    return await this.sessionRepository.findOne({
      where: { user: { idUsuario: userId }, fechaCierre: undefined },
      relations: ["user"],
    });
  }

}