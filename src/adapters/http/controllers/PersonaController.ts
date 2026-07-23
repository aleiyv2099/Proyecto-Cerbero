import { Request, Response } from "express";
import { PersonaService } from "../../../core/services/personaService";
import { UserService } from "../../../core/services/userService"; // Importamos el servicio de usuario
import { Persona } from "../../../core/entity/Persona";
import { User } from "../../../core/entity/User";

export class PersonaController {
  constructor(
    private personaService: PersonaService,
    private userService: UserService
  ) {}

  async getAllPersonas(req: Request, res: Response) {
    const personas = await this.personaService.getPersonas();
    if (!personas) {
      return res.status(404).json({ message: "No personas found" });
    }
    return res.status(200).json(personas);
  }

  async getPersona(req: Request, res: Response) {
    const { id } = req.params;
  
    try {
      const persona = await this.personaService.getPersona(Number(id));
      if (!persona) {
        return res.status(404).json({ message: "Persona not found or deleted" });
      }
  
      return res.status(200).json(persona);
    } catch (error) {
      return res.status(500).json({ message: error});
    }
  }

  async createPersona(req: Request, res: Response) {
    const { nombres, apellidos, identificacion, fechaNacimiento, password } = req.body;
  
    // Requisito 4: 10 dígitos, solo números, sin 4 iguales seguidos
    if (!/^\d{10}$/.test(identificacion) || /(\d)\1{3}/.test(identificacion)) {
      return res.status(400).json({ message: "Invalid identification format" });
    }
    if (!nombres || !apellidos) {
      return res.status(400).json({ message: "Nombres y apellidos son obligatorios" });
    }
    if (!password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    try {
      const existingPersona = await this.personaService.findByIdentificacion(identificacion);
      if (existingPersona) {
        const existingUser = await this.userService.findByPersonaId(existingPersona.idPersona);
        if (existingUser) {
          return res.status(400).json({ message: "A user is already registered for this person" });
        }
      }
  
      const newPersona = existingPersona
        ? existingPersona
        : await this.personaService.createPersona({
            nombres,
            apellidos,
            identificacion,
            fechaNacimiento,
          } as Persona);

      const { userName, mail } = await this.userService.generateCredentials(nombres, apellidos);

      const newUser = await this.userService.createUser({
        userName,
        password, // se valida y encripta dentro de createUser
        mail,
        sessionActive: "I",
        status: "active",
        persona: newPersona,
      } as User);

      const { password: _omit, ...userSafe } = newUser;
      return res.status(201).json({ persona: newPersona, user: userSafe });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || String(error) });
    }
  }

  async updatePersona(req: Request, res: Response) {
    const { id } = req.params;
    const persona = req.body as Persona;
    const updatedPersona = await this.personaService.updatePersona(Number(id), persona);
    if (!updatedPersona) {
      return res.status(404).json({ message: "Persona not found" });
    }
    return res.status(200).json(updatedPersona);
  }

  async deletePersona(req: Request, res: Response) {
    const { id } = req.params;
  
    try {
      const persona = await this.personaService.getPersona(Number(id));
      if (!persona) {
        return res.status(404).json({ message: "Persona not found" });
      }
  
      // Realizar eliminación lógica
      persona.isDeleted = true;
      await this.personaService.updatePersona(Number(id), persona);
  
      return res.status(200).json({ message: "Persona deleted logically" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}