-- =====================================================================
-- Stored Procedures / Funciones (PostgreSQL - PL/pgSQL)
-- Requisito OBLIGATORIO de la prueba.
-- Ejecutar en la base de datos DESPUÉS de levantar el proyecto una vez
-- (TypeORM con synchronize=true crea las tablas al iniciar).
-- =====================================================================

-- Función: historial de inicios/cierres de sesión de un usuario específico.
-- La consume el endpoint GET /api/sessions/sessions/user/:userId (rol admin).
-- Nota: TypeORM nombra la FK del ManyToOne "user" como "userIdUsuario".
CREATE OR REPLACE FUNCTION fn_login_history(p_user_id INTEGER)
RETURNS TABLE (
  id            INTEGER,
  fecha_ingreso TIMESTAMP,
  fecha_cierre  TIMESTAMP,
  activa        BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id,
         s."fechaIngreso",
         s."fechaCierre",
         (s."fechaCierre" IS NULL) AS activa
  FROM   sessions s
  WHERE  s."userIdUsuario" = p_user_id
    AND  s."isDeleted" = false
  ORDER BY s."fechaIngreso" DESC;
END;
$$;

-- Ejemplo de uso:
-- SELECT * FROM fn_login_history(1);
