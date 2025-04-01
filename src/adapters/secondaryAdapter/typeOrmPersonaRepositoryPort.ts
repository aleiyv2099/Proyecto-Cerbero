import { Persona } from "../../core/entity/Persona";
import { PersonaRepositoryPort } from "../../core/ports/PersonaRepositoryPort";
import { AppDataSource } from "../database/data-source";

export class TypeOrmPersonaRepositoryPort implements PersonaRepositoryPort {
  private personaRepository = AppDataSource.getRepository(Persona);

  async findAll(): Promise<Persona[]> {
    return await this.personaRepository.find();
  }

  async findById(id: number): Promise<Persona | null> {
    return await this.personaRepository.findOne({ where: { idPersona: id } });
  }

  async createPersona(persona: Persona): Promise<Persona> {
    const newPersona = this.personaRepository.create(persona);
    return await this.personaRepository.save(newPersona);
  }

  async updatePersona(id: number, persona: Persona): Promise<Persona> {
    const personaToUpdate = await this.personaRepository.findOne({ where: { idPersona: id } });
    if (!personaToUpdate) {
      throw new Error("Persona not found");
    }

    Object.assign(personaToUpdate, persona);
    return await this.personaRepository.save(personaToUpdate);
  }

  async deletePersona(id: number): Promise<boolean> {
    const personaToDelete = await this.personaRepository.findOne({ where: { idPersona: id } });
    if (!personaToDelete) {
      throw new Error("Persona not found");
    }

    await this.personaRepository.remove(personaToDelete);
    return true;
  }
  async findByIdentificacion(identificacion: string): Promise<Persona | null> {
  return await this.personaRepository.findOne({ where: { identificacion } });
}
}