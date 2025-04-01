import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { User } from "../../core/entity/User";
import { Persona } from "../../core/entity/Persona";
import { Role } from "../../core/entity/Role";
import { RoleUser } from "../../core/entity/RoleUser";
import { Session } from "../../core/entity/Session";
import { RolOpciones } from "../../core/entity/RolOpciones";
import { RolRolOpciones } from "../../core/entity/RolRolOpciones";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: NODE_ENV === "dev" ? true : false,
  logging: NODE_ENV === "dev" ? true : false,
  entities: [User, Persona, Role, RoleUser, Session, RolOpciones, RolRolOpciones],
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});