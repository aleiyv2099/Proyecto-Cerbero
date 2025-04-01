import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { RolRolOpciones } from "./RolRolOpciones";

@Entity("rol_opciones")
export class RolOpciones {
  @PrimaryGeneratedColumn()
  idOpcion!: number;

  @Column({ length: 50 })
  nombreOpcion!: string;

  @OneToMany(() => RolRolOpciones, (rolRolOpciones) => rolRolOpciones.rolOpciones)
  rolRolOpciones!: RolRolOpciones[];
}