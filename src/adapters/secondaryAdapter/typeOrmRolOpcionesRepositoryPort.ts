import { RolOpciones } from "../../core/entity/RolOpciones";
import { RolOpcionesRepositoryPort } from "../../core/ports/RolOpcionesRepositoryPort";
import { AppDataSource } from "../database/data-source";

export class TypeOrmRolOpcionesRepositoryPort implements RolOpcionesRepositoryPort {
  private rolOpcionesRepository = AppDataSource.getRepository(RolOpciones);

  async findAll(): Promise<RolOpciones[]> {
    return await this.rolOpcionesRepository.find();
  }

  async findById(id: number): Promise<RolOpciones | null> {
    return await this.rolOpcionesRepository.findOne({ where: { idOpcion: id } });
  }

  async createRolOpciones(rolOpciones: RolOpciones): Promise<RolOpciones> {
    const newRolOpciones = this.rolOpcionesRepository.create(rolOpciones);
    return await this.rolOpcionesRepository.save(newRolOpciones);
  }

  async updateRolOpciones(id: number, rolOpciones: RolOpciones): Promise<RolOpciones> {
    const rolOpcionesToUpdate = await this.rolOpcionesRepository.findOne({ where: { idOpcion: id } });
    if (!rolOpcionesToUpdate) {
      throw new Error("RolOpciones not found");
    }

    Object.assign(rolOpcionesToUpdate, rolOpciones);
    return await this.rolOpcionesRepository.save(rolOpcionesToUpdate);
  }

  async deleteRolOpciones(id: number): Promise<boolean> {
    const rolOpcionesToDelete = await this.rolOpcionesRepository.findOne({ where: { idOpcion: id } });
    if (!rolOpcionesToDelete) {
      throw new Error("RolOpciones not found");
    }

    await this.rolOpcionesRepository.remove(rolOpcionesToDelete);
    return true;
  }
}