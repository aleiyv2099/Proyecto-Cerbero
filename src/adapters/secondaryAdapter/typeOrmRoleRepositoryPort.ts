import { Role } from "../../core/entity/Role";
import { RoleRepositoryPort } from "../../core/ports/RoleRepositoryPort";
import { AppDataSource } from "../database/data-source";

export class TypeOrmRoleRepositoryPort implements RoleRepositoryPort {
  private roleRepository = AppDataSource.getRepository(Role);

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findById(id: number): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { idRol: id } });
  }

  async createRole(role: Role): Promise<Role> {
    const newRole = this.roleRepository.create(role);
    return await this.roleRepository.save(newRole);
  }

  async updateRole(id: number, role: Role): Promise<Role> {
    const roleToUpdate = await this.roleRepository.findOne({ where: { idRol: id } });
    if (!roleToUpdate) {
      throw new Error("Role not found");
    }

    Object.assign(roleToUpdate, role);
    return await this.roleRepository.save(roleToUpdate);
  }

  async deleteRole(id: number): Promise<boolean> {
    const roleToDelete = await this.roleRepository.findOne({ where: { idRol: id } });
    if (!roleToDelete) {
      throw new Error("Role not found");
    }

    await this.roleRepository.remove(roleToDelete);
    return true;
  }
  async findByName(roleName: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { rolName: roleName } }); // Cambiado a "rolName"
  }
}