import { RolRolOpciones } from "../entity/RolRolOpciones";

export interface RolRolOpcionesRepositoryPort {
  findAll(): Promise<RolRolOpciones[]>;
  findById(id: number): Promise<RolRolOpciones | null>;
  createRolRolOpciones(rolRolOpciones: RolRolOpciones): Promise<RolRolOpciones>;
  updateRolRolOpciones(id: number, rolRolOpciones: RolRolOpciones): Promise<RolRolOpciones>;
  deleteRolRolOpciones(id: number): Promise<boolean>;
}