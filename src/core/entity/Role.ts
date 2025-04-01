import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RoleUser } from "./RoleUser";

@Entity("rol")
export class Role {
  @PrimaryGeneratedColumn()
  idRol!: number;

  @Column({ length: 50 })
  rolName!: string;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @OneToMany(() => RoleUser, (roleUser) => roleUser.role)
  roleUsers!: RoleUser[];
}