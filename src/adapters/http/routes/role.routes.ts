import * as express from "express";
import { TypeOrmRoleRepositoryPort } from "../../secondaryAdapter/typeOrmRoleRepositoryPort";
import { RoleController } from "../controllers/RoleController";
import { RoleService } from "../../../core/services/roleService";
import { Middleware } from "../middleware/middleware";

const router = express.Router();
const roleRepository = new TypeOrmRoleRepositoryPort();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

router.get("/roles", roleController.getAllRoles.bind(roleController));
router.post("/role/create", roleController.createRole.bind(roleController));
router.get("/role/:id", roleController.getRole.bind(roleController));
router.put("/role/:id", roleController.updateRole.bind(roleController));
router.delete("/role/:id", roleController.deleteRole.bind(roleController));

export default router;