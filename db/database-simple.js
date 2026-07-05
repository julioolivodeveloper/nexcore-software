// Versión simplificada que no requiere conexión inmediata a Supabase

const config = require('./config');

async function checkConnection() {
  if (!config.isConfigured) {
    throw new Error('Supabase no está configurado. Configura las variables en Vercel.');
  }
  return true;
}

async function run(sql, params = []) {
  await checkConnection();
  // Aquí iría la lógica real con Supabase
  return { id: 1, changes: 1 };
}

async function get(table, filters = {}) {
  await checkConnection();
  return null;
}

async function all(table, filters = {}) {
  await checkConnection();
  return [];
}

module.exports = {
  run,
  get,
  all,
  checkConnection
};
