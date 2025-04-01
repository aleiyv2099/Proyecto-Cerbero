import { Role } from "../entity/Role";
import { RoleRepositoryPort } from "../ports/RoleRepositoryPort";

export class RoleService {
  constructor(private readonly roleRepository: RoleRepositoryPort) {}

  async getRoles(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }

  async createRole(role: Role): Promise<Role> {
    return await this.roleRepository.createRole(role);
  }

  async updateRole(id: number, role: Role): Promise<Role> {
    return await this.roleRepository.updateRole(id, role);
  }

  async deleteRole(id: number): Promise<boolean> {
    return await this.roleRepository.deleteRole(id);
  }

  async getRole(id: number): Promise<Role | null> {
    const role = await this.roleRepository.findById(id);
    if (role && role.isDeleted) {
      return null; // Retornar null si el rol está eliminado
    }
    return role;
  }
}