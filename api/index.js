require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'nexcore-accounting-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'views')));

// Rutas de API - Las importamos aquí para que se carguen solo cuando sea necesario
let authRoutes, clientRoutes, invoiceRoutes, reportRoutes;

try {
  authRoutes = require('../routes/auth');
  clientRoutes = require('../routes/clients');
  invoiceRoutes = require('../routes/invoices');
  reportRoutes = require('../routes/reports');
} catch (err) {
  console.error('Error cargando rutas:', err.message);
  // Continuamos sin las rutas si hay error
}

if (authRoutes) app.use('/api/auth', authRoutes);
if (clientRoutes) app.use('/api/clients', clientRoutes);
if (invoiceRoutes) app.use('/api/invoices', invoiceRoutes);
if (reportRoutes) app.use('/api/reports', reportRoutes);

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
