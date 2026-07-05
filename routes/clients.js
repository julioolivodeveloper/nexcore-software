const express = require('express');
const { run, get, all } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const clients = await all('SELECT * FROM clients ORDER BY name ASC');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const client = await get('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, tax_id, business_name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nombre requerido' });
    }

    const result = await run(
      `INSERT INTO clients (name, email, phone, address, tax_id, business_name)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email || null, phone || null, address || null, tax_id || null, business_name || null]
    );

    res.status(201).json({
      id: result.id,
      name,
      email,
      phone,
      address,
      tax_id,
      business_name
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, tax_id, business_name } = req.body;

    const result = await run(
      `UPDATE clients SET
       name = ?, email = ?, phone = ?, address = ?, tax_id = ?, business_name = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, phone, address, tax_id, business_name, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await run('DELETE FROM clients WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
