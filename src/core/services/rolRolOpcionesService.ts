import { RolRolOpciones } from "../entity/RolRolOpciones";
import { RolRolOpcionesRepositoryPort } from "../ports/RolRolOpcionesRepositoryPort";

export class RolRolOpcionesService {
  constructor(private readonly rolRolOpcionesRepository: RolRolOpcionesRepositoryPort) {}

  async getRolRolOpciones(): Promise<RolRolOpciones[]> {
    return await this.rolRolOpcionesRepository.findAll();
  }

  async createRolRolOpciones(rolRolOpciones: RolRolOpciones): Promise<RolRolOpciones> {
    return await this.rolRolOpcionesRepository.createRolRolOpciones(rolRolOpciones);
  }

  async updateRolRolOpciones(id: number, rolRolOpciones: RolRolOpciones): Promise<RolRolOpciones> {
    return await this.rolRolOpcionesRepository.updateRolRolOpciones(id, rolRolOpciones);
  }

  async deleteRolRolOpciones(id: number): Promise<boolean> {
    return await this.rolRolOpcionesRepository.deleteRolRolOpciones(id);
  }

  async getRolRolOpcionesById(id: number): Promise<RolRolOpciones | null> {
    return await this.rolRolOpcionesRepository.findById(id);
  }
}