import { Persona } from "../entity/Persona";
import { PersonaRepositoryPort } from "../ports/PersonaRepositoryPort";

export class PersonaService {
  constructor(private readonly personaRepository: PersonaRepositoryPort) {}

  async getPersonas(): Promise<Persona[]> {
    return await this.personaRepository.findAll();
  }

  async createPersona(persona: Persona): Promise<Persona> {
    // Validación adicional si es necesario
    if (!persona.nombres || !persona.apellidos) {
      throw new Error("Nombres y apellidos son obligatorios");
    }
    return await this.personaRepository.createPersona(persona);
  }

  async updatePersona(id: number, persona: Persona): Promise<Persona> {
    const existingPersona = await this.personaRepository.findById(id);
    if (!existingPersona) {
      throw new Error("Persona no encontrada");
    }
    return await this.personaRepository.updatePersona(id, persona);
  }

  async deletePersona(id: number): Promise<boolean> {
    const existingPersona = await this.personaRepository.findById(id);
    if (!existingPersona) {
      throw new Error("Persona no encontrada");
    }
    return await this.personaRepository.deletePersona(id);
  }

  async getPersona(id: number): Promise<Persona | null> {
    const persona = await this.personaRepository.findById(id);
    if (persona && persona.isDeleted) {
      return null; // Retornar null si la persona está eliminada
    }
    return persona;
  }
  async findByIdentificacion(identificacion: string): Promise<Persona | null> {
    return await this.personaRepository.findByIdentificacion(identificacion);
  }
}