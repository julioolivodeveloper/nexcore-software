const express = require('express');
const bcrypt = require('bcryptjs');
const { isNotAuthenticated, isAuthenticated } = require('../middleware/auth');
const { isConfigured } = require('../db/config');

let dbModule;
try {
  dbModule = require('../db/database');
} catch (err) {
  console.error('Error cargando módulo de BD:', err.message);
}

const router = express.Router();

router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email, hashedPassword, name || '']
    );

    req.session.user = { id: result.id, email };
    res.json({ success: true, message: 'Usuario registrado' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email ya registrado' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.post('/login', isNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const user = await get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    req.session.user = { id: user.id, email: user.email, name: user.name };
    res.json({ success: true, message: 'Sesión iniciada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});

router.get('/me', isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

module.exports = router;
