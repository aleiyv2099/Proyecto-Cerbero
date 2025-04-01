import { Request, Response } from "express";
import { RoleService } from "../../../core/services/roleService";
import { Role } from "../../../core/entity/Role";

export class RoleController {
  constructor(private roleService: RoleService) {}

  async getAllRoles(req: Request, res: Response) {
    const roles = await this.roleService.getRoles();
    if (!roles) {
      return res.status(404).json({ message: "No roles found" });
    }
    return res.status(200).json(roles);
  }

  async getRole(req: Request, res: Response) {
    const { id } = req.params;
    const role = await this.roleService.getRole(Number(id));
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(role);
  }

  async createRole(req: Request, res: Response) {
    const { rolName } = req.body;
    const newRole = await this.roleService.createRole({ rolName } as Role);
    return res.status(201).json({ role: newRole });
  }

  async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const role = req.body as Role;
    const updatedRole = await this.roleService.updateRole(Number(id), role);
    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json(updatedRole);
  }

  async deleteRole(req: Request, res: Response) {
    const { id } = req.params;
  
    try {
      const role = await this.roleService.getRole(Number(id));
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
  
      // Realizar eliminación lógica
      role.isDeleted = true;
      await this.roleService.updateRole(Number(id), role);
  
      return res.status(200).json({ message: "Role deleted logically" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}