import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Session } from "./Session";
import { RoleUser } from "./RoleUser";
import { Persona } from "./Persona";

@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn()
  idUsuario!: number;

  @Column({ length: 50 })
  userName!: string;

  @Column({ length: 100 })
  password!: string;

  @Column({ length: 120 })
  mail!: string;

  @Column({ type: "char", length: 1, default: "I" }) // "A" para activo, "I" para inactivo
  sessionActive!: string;
  
  @Column({ type: "char", length: 20, default: "active" }) // "active" o "blocked"
  status!: string;

  @Column({ type: "int", default: 0 }) 
  failedAttempts!: number;

  @ManyToOne(() => Persona, (persona) => persona.users, { nullable: false })
  persona!: Persona;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => RoleUser, (roleUser) => roleUser.user)
  roles!: RoleUser[];

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}