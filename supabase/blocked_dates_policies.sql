-- Asegurar que la tabla de fechas bloqueadas tenga los permisos correctos
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Permitir que todos vean las fechas bloqueadas
DROP POLICY IF EXISTS "Public blocked dates are viewable" ON blocked_dates;
CREATE POLICY "Public blocked dates are viewable" ON blocked_dates FOR SELECT USING (true);

-- Permitir insertar y borrar (usado por el panel de admin)
DROP POLICY IF EXISTS "Enable insert for all users" ON blocked_dates;
CREATE POLICY "Enable insert for all users" ON blocked_dates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable delete for all users" ON blocked_dates;
CREATE POLICY "Enable delete for all users" ON blocked_dates FOR DELETE USING (true);
