-- Ejecutar en Supabase → SQL Editor
-- Tablas simples para facturas, clientes y gastos del sistema de contabilidad

CREATE TABLE IF NOT EXISTS acct_invoices (
  id BIGSERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  issue_date TEXT,
  due_date TEXT,
  notes TEXT DEFAULT '',
  items JSONB DEFAULT '[]',
  total NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IDs nuevas facturas empiezan en 500 (para no chocar con datos históricos hardcodeados)
SELECT setval('acct_invoices_id_seq', 500);

CREATE TABLE IF NOT EXISTS acct_clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IDs nuevos clientes empiezan en 200
SELECT setval('acct_clients_id_seq', 200);
