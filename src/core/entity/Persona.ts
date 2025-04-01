import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

@Entity("persona")
export class Persona {
  @PrimaryGeneratedColumn()
  idPersona!: number;

  @Column({ length: 60 })
  nombres!: string;

  @Column({ length: 60 })
  apellidos!: string;

  @Column({ length: 10 })
  identificacion!: string;

  @Column({ type: "date" })
  fechaNacimiento!: Date;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @OneToMany(() => User, (user) => user.persona)
  users!: User[];
}