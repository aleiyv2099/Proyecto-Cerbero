import { Role } from "../entity/Role";

export interface RoleRepositoryPort {
  findAll(): Promise<Role[]>;
  findById(id: number): Promise<Role | null>;
  createRole(role: Role): Promise<Role>;
  updateRole(id: number, role: Role): Promise<Role>;
  deleteRole(id: number): Promise<boolean>;
  findByName(roleName: string): Promise<Role | null>; // Asegúrate de que este método exista en el repositorio
}