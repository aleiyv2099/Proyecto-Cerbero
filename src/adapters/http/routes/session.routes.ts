import * as express from "express";
import { TypeOrmSessionRepositoryPort } from "../../secondaryAdapter/typeOrmSessionRepositoryPort";
import { SessionController } from "../controllers/SessionController";
import { SessionService } from "../../../core/services/sessionService";
import { Middleware } from "../middleware/middleware";

const router = express.Router();
const sessionRepository = new TypeOrmSessionRepositoryPort();
const sessionService = new SessionService(sessionRepository);
const sessionController = new SessionController(sessionService);

router.get("/sessions", sessionController.getAllSessions.bind(sessionController));
router.get("/session/:id", sessionController.getSession.bind(sessionController));

// Requisito V: solo un usuario con rol "admin" puede revisar el historial de otro
router.get(
  "/sessions/user/:userId",
  Middleware.verifyToken,
  Middleware.requireRole("admin"),
  sessionController.getUserLoginHistory.bind(sessionController)
);

export default router;