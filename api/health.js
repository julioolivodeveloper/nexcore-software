module.exports = (req, res) => {
  const config = {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_URL: process.env.SUPABASE_URL ? '✓ Configurado' : '✗ NO configurado',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '✓ Configurado' : '✗ NO configurado',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Configurado' : '✗ NO configurado',
    SESSION_SECRET: process.env.SESSION_SECRET ? '✓ Configurado' : '✗ NO configurado'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    configuration: config
  });
};
