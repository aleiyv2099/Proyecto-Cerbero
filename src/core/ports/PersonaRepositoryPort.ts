import { Persona } from "../entity/Persona";

export interface PersonaRepositoryPort {
  findAll(): Promise<Persona[]>;
  findById(id: number): Promise<Persona | null>;
  createPersona(persona: Persona): Promise<Persona>;
  updatePersona(id: number, persona: Persona): Promise<Persona>;
  deletePersona(id: number): Promise<boolean>;
  findByIdentificacion(identificacion: string): Promise<Persona | null>;
}