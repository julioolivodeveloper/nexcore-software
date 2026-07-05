require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./db/database');
const { isAuthenticated, isNotAuthenticated } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3003;

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
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const invoiceRoutes = require('./routes/invoices');
const reportRoutes = require('./routes/reports');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);

app.get('/accounting/login', isNotAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/accounting/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/accounting/clients', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'clients.html'));
});

app.get('/accounting/invoices', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'invoices.html'));
});

app.get('/accounting/reports', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reports.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function start() {
  try {
    await initDatabase();
    console.log('✓ Base de datos inicializada');

    app.listen(PORT, () => {
      console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`✓ Acceso a contabilidad: http://localhost:${PORT}/accounting/login`);
      console.log(`✓ Credenciales: jojulioneto1@gmail.com / Julioolivo94@`);
    });
  } catch (err) {
    console.error('Error al iniciar:', err);
    process.exit(1);
  }
}

start();
