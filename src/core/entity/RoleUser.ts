import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Role } from "./Role";

@Entity("rol_usuarios")
export class RoleUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role, (role) => role.roleUsers, { nullable: false })
  role!: Role;

  @ManyToOne(() => User, (user) => user.roles, { nullable: false })
  user!: User;
}