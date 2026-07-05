const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initDatabase() {
  try {
    const { error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('Creando tablas...');
      await createTables();
    }
    console.log('✓ Conexión a Supabase establecida');
  } catch (err) {
    console.error('Error inicializando BD:', err);
    throw err;
  }
}

async function createTables() {
  try {
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS clients (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address TEXT,
          tax_id TEXT,
          business_name TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS invoices (
          id BIGSERIAL PRIMARY KEY,
          invoice_number TEXT UNIQUE NOT NULL,
          client_id BIGINT NOT NULL REFERENCES clients(id),
          issue_date TIMESTAMP DEFAULT NOW(),
          due_date TIMESTAMP,
          status TEXT DEFAULT 'draft',
          subtotal NUMERIC DEFAULT 0,
          tax NUMERIC DEFAULT 0,
          total NUMERIC DEFAULT 0,
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS invoice_items (
          id BIGSERIAL PRIMARY KEY,
          invoice_id BIGINT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
          description TEXT NOT NULL,
          quantity INTEGER DEFAULT 1,
          unit_price NUMERIC NOT NULL,
          amount NUMERIC NOT NULL
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id BIGSERIAL PRIMARY KEY,
          type TEXT NOT NULL,
          amount NUMERIC NOT NULL,
          description TEXT,
          category TEXT,
          invoice_id BIGINT REFERENCES invoices(id),
          created_at TIMESTAMP DEFAULT NOW()
        );
      `
    });
  } catch (err) {
    console.log('Tablas ya existen o error menor:', err.message);
  }
}

async function run(sql, params = []) {
  // Placeholder para mantener compatibilidad
  return { id: 1, changes: 1 };
}

async function get(table, filters = {}) {
  const query = supabase.from(table).select('*');

  Object.entries(filters).forEach(([key, value]) => {
    query.eq(key, value);
  });

  const { data, error } = await query.limit(1).single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

async function all(table, filters = {}, orderBy = null) {
  let query = supabase.from(table).select('*');

  Object.entries(filters).forEach(([key, value]) => {
    query.eq(key, value);
  });

  if (orderBy) {
    const [column, ascending] = Array.isArray(orderBy)
      ? orderBy
      : [orderBy, false];
    query.order(column, { ascending });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

module.exports = {
  supabase,
  initDatabase,
  run,
  get,
  all
};
