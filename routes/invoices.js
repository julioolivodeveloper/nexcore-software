const express = require('express');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const { getClient } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
router.use(isAuthenticated);

// GET / — all invoices with client name
router.get('/', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from('invoices')
      .select('*, clients(name)')
      .order('issue_date', { ascending: false });

    if (error) throw error;

    const invoices = (data || []).map(inv => ({
      ...inv,
      client_name: inv.clients?.name,
      clients: undefined
    }));

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id — single invoice with client info + items
router.get('/:id', async (req, res) => {
  try {
    const sb = getClient();

    const { data: inv, error } = await sb
      .from('invoices')
      .select('*, clients(name, email, phone, address, tax_id, business_name)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Factura no encontrada' });

    const { data: items } = await sb
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', req.params.id);

    res.json({
      ...inv,
      client_name:   inv.clients?.name,
      email:         inv.clients?.email,
      phone:         inv.clients?.phone,
      address:       inv.clients?.address,
      tax_id:        inv.clients?.tax_id,
      business_name: inv.clients?.business_name,
      clients:       undefined,
      items:         items || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / — create invoice + items
router.post('/', async (req, res) => {
  try {
    const { client_id, due_date, notes, items, status } = req.body;

    if (!client_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Cliente e ítems requeridos' });
    }

    const invoiceNumber = `INV-${Date.now()}-${uuidv4().slice(0, 8)}`;
    let subtotal = 0;
    items.forEach(item => {
      item.amount = item.quantity * item.unit_price;
      subtotal += item.amount;
    });
    const tax   = subtotal * 0.13;
    const total = subtotal + tax;

    const sb = getClient();

    const { data: invoice, error: invErr } = await sb
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        client_id,
        due_date:  due_date || null,
        status:    status   || 'pending',
        subtotal,
        tax,
        total,
        notes: notes || null
      })
      .select()
      .single();

    if (invErr) throw invErr;

    const itemRows = items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity:    item.quantity,
      unit_price:  item.unit_price,
      amount:      item.amount
    }));

    const { error: itemsErr } = await sb.from('invoice_items').insert(itemRows);
    if (itemsErr) throw itemsErr;

    res.status(201).json({ id: invoice.id, invoice_number: invoiceNumber, subtotal, tax, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /:id — update invoice + items
router.put('/:id', async (req, res) => {
  try {
    const { due_date, notes, items, status } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      item.amount = item.quantity * item.unit_price;
      subtotal += item.amount;
    });
    const tax   = subtotal * 0.13;
    const total = subtotal + tax;

    const sb = getClient();

    const { error: updErr } = await sb
      .from('invoices')
      .update({ due_date, notes, subtotal, tax, total, status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id);

    if (updErr) throw updErr;

    await sb.from('invoice_items').delete().eq('invoice_id', req.params.id);

    const itemRows = items.map(item => ({
      invoice_id:  parseInt(req.params.id),
      description: item.description,
      quantity:    item.quantity,
      unit_price:  item.unit_price,
      amount:      item.amount
    }));

    const { error: itemsErr } = await sb.from('invoice_items').insert(itemRows);
    if (itemsErr) throw itemsErr;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /:id
router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await getClient()
      .from('invoices')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id/pdf
router.get('/:id/pdf', async (req, res) => {
  try {
    const sb = getClient();

    const { data: inv, error } = await sb
      .from('invoices')
      .select('*, clients(name, email, phone, address, tax_id, business_name)')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Factura no encontrada' });

    const { data: items } = await sb
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', req.params.id);

    const invoice = {
      ...inv,
      client_name:   inv.clients?.name,
      email:         inv.clients?.email,
      phone:         inv.clients?.phone,
      address:       inv.clients?.address,
      tax_id:        inv.clients?.tax_id,
      business_name: inv.clients?.business_name
    };

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura_${invoice.invoice_number}.pdf"`);
    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('FACTURA', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(invoice.invoice_number, { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).font('Helvetica-Bold').text('Información del Negocio', { underline: true });
    doc.font('Helvetica').fontSize(9);
    doc.text('www.julioolivodeveloper.com');
    doc.moveDown();

    doc.fontSize(10).font('Helvetica-Bold').text('Información del Cliente', { underline: true });
    doc.font('Helvetica').fontSize(9);
    doc.text(invoice.client_name || 'N/A');
    if (invoice.business_name) doc.text(`Empresa: ${invoice.business_name}`);
    if (invoice.tax_id)        doc.text(`RUC/Cédula: ${invoice.tax_id}`);
    if (invoice.email)         doc.text(`Email: ${invoice.email}`);
    if (invoice.phone)         doc.text(`Teléfono: ${invoice.phone}`);
    if (invoice.address)       doc.text(`Dirección: ${invoice.address}`);
    doc.moveDown();

    doc.fontSize(9).font('Helvetica-Bold').text('Detalles de la Factura');
    doc.text(`Fecha: ${new Date(invoice.issue_date).toLocaleDateString('es-ES')}`);
    if (invoice.due_date) doc.text(`Vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-ES')}`);
    doc.moveDown();

    const tableTop = doc.y;
    const c1 = 40, c2 = 250, c3 = 360, c4 = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Descripción', c1, tableTop);
    doc.text('Cantidad',    c2, tableTop);
    doc.text('Precio Unit.',c3, tableTop);
    doc.text('Total',       c4, tableTop);
    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica').fontSize(9);
    let pos = tableTop + 25;
    (items || []).forEach(item => {
      doc.text(item.description.substring(0, 30), c1, pos);
      doc.text(item.quantity.toString(),           c2, pos);
      doc.text(`$${item.unit_price.toFixed(2)}`,  c3, pos);
      doc.text(`$${item.amount.toFixed(2)}`,       c4, pos);
      pos += 20;
    });

    doc.moveTo(40, pos).lineTo(550, pos).stroke();
    pos += 10;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Subtotal:', c3, pos); doc.text(`$${invoice.subtotal.toFixed(2)}`, c4, pos); pos += 20;
    doc.text('IVA (13%):', c3, pos); doc.text(`$${invoice.tax.toFixed(2)}`, c4, pos); pos += 20;
    doc.fontSize(12);
    doc.text('TOTAL:', c3, pos); doc.text(`$${invoice.total.toFixed(2)}`, c4, pos);

    if (invoice.notes) {
      doc.moveDown(2);
      doc.fontSize(9).font('Helvetica-Bold').text('Notas:');
      doc.font('Helvetica').text(invoice.notes);
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
