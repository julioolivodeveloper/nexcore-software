const express = require('express');
const bcrypt = require('bcryptjs');
const { isNotAuthenticated, isAuthenticated } = require('../middleware/auth');
const { getClient } = require('../db/database');

const router = express.Router();

router.post('/register', isNotAuthenticated, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await getClient()
      .from('users')
      .insert({ email, password: hashedPassword, name: name || '' })
      .select()
      .single();

    if (error) {
      if (error.message.includes('unique') || error.code === '23505') {
        return res.status(400).json({ error: 'Email ya registrado' });
      }
      throw error;
    }

    req.session.user = { id: data.id, email: data.email, name: data.name };
    res.json({ success: true, message: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', isNotAuthenticated, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const { data: user, error } = await getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
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
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar sesión' });
    res.json({ success: true, message: 'Sesión cerrada' });
  });
});

router.get('/me', isAuthenticated, (req, res) => {
  res.json(req.session.user);
});

module.exports = router;
