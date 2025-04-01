import { RolOpciones } from "../entity/RolOpciones";

export interface RolOpcionesRepositoryPort {
  findAll(): Promise<RolOpciones[]>;
  findById(id: number): Promise<RolOpciones | null>;
  createRolOpciones(rolOpciones: RolOpciones): Promise<RolOpciones>;
  updateRolOpciones(id: number, rolOpciones: RolOpciones): Promise<RolOpciones>;
  deleteRolOpciones(id: number): Promise<boolean>;
}