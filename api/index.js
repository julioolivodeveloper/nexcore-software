require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - SIN middleware
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    supabase_url: !!process.env.SUPABASE_URL,
    supabase_key: !!process.env.SUPABASE_ANON_KEY,
    timestamp: new Date().toISOString()
  });
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'views')));

// Rutas para vistas HTML
app.get('/accounting/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

app.get('/accounting/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

app.get('/accounting/clients', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'clients.html'));
});

app.get('/accounting/invoices', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'invoices.html'));
});

app.get('/accounting/reports', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'reports.html'));
});

// API de autenticación (sin validar contraseña por ahora, solo demo)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Por ahora, aceptar cualquier login (DEMO)
  if (email === 'jojulioneto1@gmail.com' && password === 'Julioolivo94@') {
    res.json({ success: true, message: 'Sesión iniciada' });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada' });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ email: 'jojulioneto1@gmail.com', name: 'Admin' });
});

// API de clientes (placeholders)
app.get('/api/clients', (req, res) => {
  res.json([]);
});

app.post('/api/clients', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

// API de facturas
app.get('/api/invoices', (req, res) => {
  res.json([]);
});

app.post('/api/invoices', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

// API de reportes
app.get('/api/reports/dashboard', (req, res) => {
  res.json({
    totalInvoices: 0,
    totalClients: 0,
    pendingInvoices: 0,
    revenue: 0,
    monthlyRevenue: []
  });
});

// Ruta por defecto
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
