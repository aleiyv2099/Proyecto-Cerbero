import { RoleUser } from "../entity/RoleUser";
import { RoleUserRepositoryPort } from "../ports/RoleUserRepositoryPort";

export class RoleUserService {
  constructor(private readonly roleUserRepository: RoleUserRepositoryPort) {}

  async getRoleUsers(): Promise<RoleUser[]> {
    return await this.roleUserRepository.findAll();
  }

  async createRoleUser(roleUser: RoleUser): Promise<RoleUser> {
    return await this.roleUserRepository.createRoleUser(roleUser);
  }

  async updateRoleUser(id: number, roleUser: RoleUser): Promise<RoleUser> {
    return await this.roleUserRepository.updateRoleUser(id, roleUser);
  }

  async deleteRoleUser(id: number): Promise<boolean> {
    return await this.roleUserRepository.deleteRoleUser(id);
  }

  async getRoleUser(id: number): Promise<RoleUser | null> {
    return await this.roleUserRepository.findById(id);
  }
}