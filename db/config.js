const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Variables de Supabase no configuradas. Las APIs no funcionarán.');
  console.warn('Configura en Vercel: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY');
}

module.exports = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceKey,
  isConfigured: !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
};
