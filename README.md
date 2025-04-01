# API REST - Gestión de Usuarios, Roles, Personas y Sesiones

## Descripción
Esta API-REST permite gestionar usuarios, roles, personas y sesiones. Incluye funcionalidades como inicio de sesión, cierre de sesión, validaciones de datos, y restricciones de acceso basadas en roles. La API está diseñada para cumplir con los requisitos de seguridad y validación establecidos.

---

## Tecnologías utilizadas
- **Node.js**: v16.x o superior
- **Express**: v4.x
- **TypeORM**: v0.3.x
- **PostgreSQL**: v14.x
- **dotenv**: Para manejo de variables de entorno
- **cors**: Para habilitar solicitudes desde diferentes orígenes

---

## Requisitos previos
1. **Node.js**: Instalar desde [Node.js](https://nodejs.org/).
2. **PostgreSQL**: Instalar desde [PostgreSQL](https://www.postgresql.org/).
3. **Instalar dependencias**:
   ```bash
   npm install

## Configuración del entorno
1. Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_DATABASE=nombre_de_tu_base_de_datos
   JWT_SECRET=tu_secreto_jwt
   ```

## Scripts disponibles
- **Iniciar el servidor**:
   ```bash
   npm start
   ```
- **Modo desarrollo**:
   ```bash
   npm run dev
   ```

---

## Validaciones implementadas
### Usuarios
- **Nombre de usuario**:
  - No contiene signos.
  - Al menos un número y una letra mayúscula.
  - Longitud entre 8 y 20 caracteres.
- **Contraseña**:
  - Al menos 8 caracteres.
  - Al menos una letra mayúscula y un signo.
  - No contiene espacios.
- **Identificación**:
  - Exactamente 10 dígitos.
  - Solo números.
  - No tiene 4 números consecutivos iguales.

  ### Restricciones
- Un usuario solo puede tener una sesión activa.
- Un usuario tiene 3 intentos para ingresar la contraseña incorrecta antes de ser bloqueado.

---