const express = require('express');
const { getClient } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from('clients')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from('clients')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address, tax_id, business_name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nombre requerido' });

    const { data, error } = await getClient()
      .from('clients')
      .insert({
        name,
        email:         email         || null,
        phone:         phone         || null,
        address:       address       || null,
        tax_id:        tax_id        || null,
        business_name: business_name || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address, tax_id, business_name } = req.body;

    const { data, error } = await getClient()
      .from('clients')
      .update({ name, email, phone, address, tax_id, business_name, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from('clients')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
