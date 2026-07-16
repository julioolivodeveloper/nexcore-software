const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

let _client = null;

function getClient() {
  if (!config.isConfigured) {
    throw new Error('Supabase no configurado. Verifica SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY en Vercel.');
  }
  if (!_client) {
    _client = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey || config.supabaseAnonKey
    );
  }
  return _client;
}

module.exports = { getClient };
