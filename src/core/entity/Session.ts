import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "date" })
  fechaIngreso!: Date;

  @Column({ type: "date", nullable: true })
  fechaCierre!: Date;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @ManyToOne(() => User, (user) => user.sessions, { nullable: false })
  user!: User;
}