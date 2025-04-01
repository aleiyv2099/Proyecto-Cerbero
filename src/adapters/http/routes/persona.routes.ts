import * as express from "express";
import { TypeOrmPersonaRepositoryPort } from "../../secondaryAdapter/typeOrmPersonaRepositoryPort";
import { TypeOrmUserRepositoryPort } from "../../secondaryAdapter/typeOmUserRepositoryPort"; 
import { PersonaController } from "../controllers/PersonaController";
import { PersonaService } from "../../../core/services/personaService";
import { UserService } from "../../../core/services/userService"; 
import { Middleware } from "../middleware/middleware";

const router = express.Router();

const personaRepository = new TypeOrmPersonaRepositoryPort();
const userRepository = new TypeOrmUserRepositoryPort(); 

const personaService = new PersonaService(personaRepository);
const userService = new UserService(userRepository); 

const personaController = new PersonaController(personaService, userService); 

router.get("/personas", personaController.getAllPersonas.bind(personaController));
router.post("/persona/create", personaController.createPersona.bind(personaController));
router.get("/persona/:id", personaController.getPersona.bind(personaController));
router.put("/persona/:id", personaController.updatePersona.bind(personaController));
router.delete("/persona/:id", personaController.deletePersona.bind(personaController));

export default router;