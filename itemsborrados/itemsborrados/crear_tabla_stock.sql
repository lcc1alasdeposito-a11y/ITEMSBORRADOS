-- Crear tabla STOCK para almacenar stock por material y almacén
CREATE TABLE IF NOT EXISTS stock (
  id SERIAL PRIMARY KEY,
  material TEXT NOT NULL,
  descripcion TEXT,
  almacen TEXT NOT NULL,
  cantidad NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda rápida por material
CREATE INDEX IF NOT EXISTS idx_stock_material ON stock (material);

-- Habilitar Row Level Security
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura anónima
CREATE POLICY IF NOT EXISTS "Allow anonymous read stock"
  ON stock FOR SELECT
  TO anon
  USING (true);

-- Política para permitir insert/update/delete anónimo
CREATE POLICY IF NOT EXISTS "Allow anonymous all stock"
  ON stock FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
