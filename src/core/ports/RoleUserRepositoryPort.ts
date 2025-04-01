import { RoleUser } from "../entity/RoleUser";

export interface RoleUserRepositoryPort {
  findAll(): Promise<RoleUser[]>;
  findById(id: number): Promise<RoleUser | null>;
  createRoleUser(roleUser: RoleUser): Promise<RoleUser>;
  updateRoleUser(id: number, roleUser: RoleUser): Promise<RoleUser>;
  deleteRoleUser(id: number): Promise<boolean>;
}