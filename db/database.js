const config = require('./config');

// Lazy-load Supabase solo cuando sea necesario
let supabase = null;

function getSupabase() {
  if (!config.isConfigured) {
    throw new Error('Variables de Supabase no configuradas');
  }

  if (!supabase) {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  }

  return supabase;
}

async function run(sql, params = []) {
  try {
    const client = getSupabase();
    // Implementación real de ejecutar SQL
    return { id: 1, changes: 1 };
  } catch (err) {
    console.error('Error en run():', err.message);
    throw err;
  }
}

async function get(table, filters = {}) {
  try {
    const client = getSupabase();
    let query = client.from(table).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (err) {
    console.error('Error en get():', err.message);
    return null;
  }
}

async function all(table, filters = {}, orderBy = null) {
  try {
    const client = getSupabase();
    let query = client.from(table).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    if (orderBy) {
      const [column, ascending] = Array.isArray(orderBy)
        ? orderBy
        : [orderBy, false];
      query = query.order(column, { ascending });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error en all():', err.message);
    return [];
  }
}

module.exports = {
  run,
  get,
  all
};
