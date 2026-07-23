import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "timestamp" })
  fechaIngreso!: Date;

  @Column({ type: "timestamp", nullable: true })
  fechaCierre!: Date | null;

  @Column({ type: "boolean", default: false })
  isDeleted!: boolean;

  @ManyToOne(() => User, (user) => user.sessions, { nullable: false })
  user!: User;
}