import { Session } from "../entity/Session";

export interface SessionRepositoryPort {
  findAll(): Promise<Session[]>;
  findById(id: number): Promise<Session | null>;
  findByUserId(userId: number): Promise<Session[]>;
  createSession(session: Session): Promise<Session>;
  updateSession(id: number, session: Session): Promise<Session>;
  deleteSession(id: number): Promise<boolean>;
  findActiveSessionByUserId(userId: number): Promise<Session | null>;
}