import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Role } from "./Role";
import { RolOpciones } from "./RolOpciones";

@Entity("rol_rolopciones")
export class RolRolOpciones {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Role, (role) => role.roleUsers, { nullable: false })
  role!: Role;

  @ManyToOne(() => RolOpciones, (rolOpciones) => rolOpciones.rolRolOpciones, { nullable: false })
  rolOpciones!: RolOpciones;
}