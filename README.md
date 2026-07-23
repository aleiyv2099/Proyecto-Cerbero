<p align="center">
  <img src="assets/banner.svg" alt="Cerbero - API-REST de Autenticacion y Sesiones" width="100%">
</p>

<h1 align="center">Cerbero</h1>

<p align="center">
  API-REST para un sistema de Login con arquitectura hexagonal (core / adapters).<br>
  CRUD de todas las tablas, generacion automatica de usuario/correo, login con bloqueo
  por intentos, sesion unica, registro de sesiones y control por roles.
</p>

<p align="center">
  <a href="https://nodejs.org"><img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"></a>
  <a href="https://www.typescriptlang.org"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white"></a>
  <a href="https://expressjs.com"><img alt="Express" src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white"></a>
  <a href="https://typeorm.io"><img alt="TypeORM" src="https://img.shields.io/badge/TypeORM-0.3.x-FE0803?style=for-the-badge&logo=typeorm&logoColor=white"></a>
  <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"></a>
  <a href="https://jwt.io"><img alt="JWT" src="https://img.shields.io/badge/JWT-9.x-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"></a>
  <a href="https://www.npmjs.com/package/bcrypt"><img alt="bcrypt" src="https://img.shields.io/badge/bcrypt-5.x-4B5563?style=for-the-badge&logo=letsencrypt&logoColor=white"></a>
</p>

---

## Tecnologias

Cada badge enlaza a la web oficial de la herramienta.

| Tecnologia | Version | Uso en el proyecto |
|------------|---------|--------------------|
| [Node.js](https://nodejs.org) | 18+ (probado en 18/20) | Entorno de ejecucion |
| [TypeScript](https://www.typescriptlang.org) | 5.x | Lenguaje |
| [Express](https://expressjs.com) | 4.x | Servidor HTTP / rutas |
| [TypeORM](https://typeorm.io) | 0.3.x | ORM y entidades |
| [PostgreSQL](https://www.postgresql.org) | 14+ | Base de datos |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | 5.x | Hash de contrasenas |
| [jsonwebtoken](https://jwt.io) | 9.x | JWT en el login |

---

## Levantamiento

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear la base de datos en PostgreSQL (ej. `login_db`).
3. Copiar `.env.example` a `.env` y completar credenciales:
   ```bash
   cp .env.example .env
   ```
   Con `NODE_ENV=dev`, TypeORM crea las tablas automáticamente (`synchronize`).
4. Arrancar en desarrollo:
   ```bash
   npm run dev
   ```
   o compilar y ejecutar:
   ```bash
   npm start
   ```
5. **Cargar el Stored Procedure** una vez que las tablas existan:
   ```bash
   psql -U <usuario> -d <base> -f db/stored_procedures.sql
   ```

Servidor por defecto: `http://localhost:3000`.

---

## Stored Procedure / función (obligatorio)

`db/stored_procedures.sql` contiene la función PL/pgSQL **`fn_login_history(user_id)`**,
que devuelve el registro de inicios/cierres de sesión de un usuario. La consume el
endpoint `GET /api/sessions/sessions/user/:userId` (protegido con JWT + rol `admin`).

---

## Endpoints principales

Base: `/api`

| Recurso  | Método | Ruta | Nota |
|----------|--------|------|------|
| Personas | POST   | `/personas/persona/create` | Crea persona **y** usuario (genera correo/username) |
| Personas | GET/PUT/DELETE | `/personas/persona/:id` | DELETE lógico |
| Usuarios | GET    | `/users/users`, `/users/user/:id`, `/users/user/email/:email` | |
| Usuarios | PUT/DELETE | `/users/user/:id` | DELETE lógico |
| Auth     | POST   | `/users/login` | devuelve JWT |
| Auth     | POST   | `/users/logout` | body `{ userId }` |
| Roles    | GET/POST/PUT/DELETE | `/roles/...` | |
| Sesiones | GET    | `/sessions/sessions`, `/sessions/session/:id` | |
| Sesiones | GET    | `/sessions/sessions/user/:userId` | rol `admin` (usa el SP) |

Colección Postman lista en `postman/API-REST-Login.postman_collection.json`
(el request Login guarda el token automáticamente).

---

## Reglas implementadas

- **Generación (req 1.1):** `Juan Alberto Piguave Loor` → usuario `jpiguavel`, correo
  `jpiguavel@mail.com` (inicial nombre + primer apellido + inicial segundo apellido).
  Duplicados → sufijo incremental (`jpiguavel1`, `jpiguavel2`…).
- **Contraseña (req 3):** min 8, una mayúscula, un signo, sin espacios. Se guarda con **bcrypt**.
- **Identificación (req 4):** 10 dígitos, solo números, sin 4 iguales seguidos.
- **Login (req I–IV):** solo una sesión activa; 3 intentos fallidos → usuario `blocked`;
  login por correo o username; se registra ingreso/cierre en `sessions`.
- **Roles (req V):** el historial de sesiones de un usuario requiere rol `admin`.
- **Eliminaciones lógicas:** vía campo `isDeleted`.

> Nota sobre el enunciado: el requisito 2 pide que el username tenga una mayúscula y
> un número, pero el ejemplo de generación (`jpiguavel`) no los tiene. Se priorizó el
> ejemplo concreto del req 1.1; la unicidad se resuelve con el sufijo numérico.

---

## Pruebas

Self-check de la generación de credenciales (sin base de datos):
```bash
npm test
```
