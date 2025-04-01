import * as express from "express";
import { TypeOrmUserRepositoryPort } from "../../secondaryAdapter/typeOmUserRepositoryPort";
import { TypeOrmSessionRepositoryPort } from "../../secondaryAdapter/typeOrmSessionRepositoryPort"; 
import { UserController } from "../controllers/UserController";
import { SessionController } from "../controllers/SessionController"; 
import { UserService } from "../../../core/services/userService";
import { SessionService } from "../../../core/services/sessionService"; 
import { Middleware } from "../middleware/middleware";

const router = express.Router();

const userRepository = new TypeOrmUserRepositoryPort();
const sessionRepository = new TypeOrmSessionRepositoryPort(); 

const userService = new UserService(userRepository);
const sessionService = new SessionService(sessionRepository); 

const sessionController = new SessionController(sessionService);
const userController = new UserController(userService, sessionController); 

router.get("/users", userController.getAllUsers.bind(userController));
router.get("/user/:id", userController.getUser.bind(userController));
router.put("/user/:id", userController.updateUser.bind(userController));
router.delete("/user/:id", userController.deleteUser.bind(userController));
router.get("/user/email/:email", userController.getUserByEmail.bind(userController));

router.post("/login", userController.login.bind(userController)); 
router.post("/logout", userController.logout.bind(userController)); 

export default router;