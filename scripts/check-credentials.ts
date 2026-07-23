// Self-check de la generación de usuario/correo (Requisito 1.1) sin base de datos.
// Ejecutar: npm test
import * as assert from "assert";
import { UserService } from "../src/core/services/userService";
import { UserRepositoryPort } from "../src/core/ports/UserRepositoryPort";

// Repo falso: "taken" contiene los usernames/correos ya ocupados.
function fakeRepo(taken: Set<string>): UserRepositoryPort {
  return {
    findByUserName: async (u: string) => (taken.has(u) ? ({} as any) : null),
    findByEmail: async (m: string) => (taken.has(m) ? ({} as any) : null),
  } as any;
}

async function main() {
  // Caso del enunciado: Juan Alberto Piguave Loor -> jpiguavel
  let svc = new UserService(fakeRepo(new Set()));
  let c = await svc.generateCredentials("Juan Alberto", "Piguave Loor");
  assert.strictEqual(c.userName, "jpiguavel");
  assert.strictEqual(c.mail, "jpiguavel@mail.com");

  // Duplicado: agrega número incremental
  svc = new UserService(fakeRepo(new Set(["jpiguavel", "jpiguavel@mail.com"])));
  c = await svc.generateCredentials("Juan Alberto", "Piguave Loor");
  assert.strictEqual(c.userName, "jpiguavel1");
  assert.strictEqual(c.mail, "jpiguavel1@mail.com");

  // Acentos: José Ñañez -> jn... (se ignoran tildes)
  svc = new UserService(fakeRepo(new Set()));
  c = await svc.generateCredentials("José", "Ñañez Ortiz");
  assert.strictEqual(c.userName, "jnanezo");

  console.log("OK: generación de credenciales pasa todos los casos");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
