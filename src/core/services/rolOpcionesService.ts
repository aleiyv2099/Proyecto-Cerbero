import { RolOpciones } from "../entity/RolOpciones";
import { RolOpcionesRepositoryPort } from "../ports/RolOpcionesRepositoryPort";

export class RolOpcionesService {
  constructor(private readonly rolOpcionesRepository: RolOpcionesRepositoryPort) {}

  async getRolOpciones(): Promise<RolOpciones[]> {
    return await this.rolOpcionesRepository.findAll();
  }

  async createRolOpciones(rolOpciones: RolOpciones): Promise<RolOpciones> {
    return await this.rolOpcionesRepository.createRolOpciones(rolOpciones);
  }

  async updateRolOpciones(id: number, rolOpciones: RolOpciones): Promise<RolOpciones> {
    return await this.rolOpcionesRepository.updateRolOpciones(id, rolOpciones);
  }

  async deleteRolOpciones(id: number): Promise<boolean> {
    return await this.rolOpcionesRepository.deleteRolOpciones(id);
  }

  async getRolOpcionesById(id: number): Promise<RolOpciones | null> {
    return await this.rolOpcionesRepository.findById(id);
  }
}