const express = require('express');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const invoices = await all(`
      SELECT i.*, c.name as client_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY i.issue_date DESC
    `);
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const invoice = await get(`
      SELECT i.*, c.name as client_name, c.email, c.phone, c.address, c.tax_id, c.business_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);

    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const items = await all('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id]);
    invoice.items = items;

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { client_id, due_date, notes, items } = req.body;

    if (!client_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Cliente e ítems requeridos' });
    }

    const invoiceNumber = `INV-${Date.now()}-${uuidv4().slice(0, 8)}`;
    let subtotal = 0;

    items.forEach(item => {
      item.amount = item.quantity * item.unit_price;
      subtotal += item.amount;
    });

    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    const result = await run(
      `INSERT INTO invoices (invoice_number, client_id, due_date, status, subtotal, tax, total, notes)
       VALUES (?, ?, ?, 'draft', ?, ?, ?, ?)`,
      [invoiceNumber, client_id, due_date, subtotal, tax, total, notes]
    );

    for (const item of items) {
      await run(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
         VALUES (?, ?, ?, ?, ?)`,
        [result.id, item.description, item.quantity, item.unit_price, item.amount]
      );
    }

    res.status(201).json({
      id: result.id,
      invoice_number: invoiceNumber,
      subtotal,
      tax,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { due_date, notes, items, status } = req.body;

    let subtotal = 0;
    items.forEach(item => {
      item.amount = item.quantity * item.unit_price;
      subtotal += item.amount;
    });

    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    await run(
      `UPDATE invoices SET due_date = ?, notes = ?, subtotal = ?, tax = ?, total = ?, status = ?
       WHERE id = ?`,
      [due_date, notes, subtotal, tax, total, status, req.params.id]
    );

    await run('DELETE FROM invoice_items WHERE invoice_id = ?', [req.params.id]);

    for (const item of items) {
      await run(
        `INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, amount)
         VALUES (?, ?, ?, ?, ?)`,
        [req.params.id, item.description, item.quantity, item.unit_price, item.amount]
      );
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await get(`
      SELECT i.*, c.name as client_name, c.email, c.phone, c.address, c.tax_id, c.business_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      WHERE i.id = ?
    `, [req.params.id]);

    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const items = await all('SELECT * FROM invoice_items WHERE invoice_id = ?', [req.params.id]);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="factura_${invoice.invoice_number}.pdf"`);

    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('FACTURA', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text(invoice.invoice_number, { align: 'center' });
    doc.moveDown();

    doc.fontSize(10).font('Helvetica-Bold').text('Información del Negocio', { underline: true });
    doc.font('Helvetica').fontSize(9);
    doc.text('Nexcore Software', { width: 250 });
    doc.text('Contacto: info@nexcore.com');
    doc.moveDown();

    doc.fontSize(10).font('Helvetica-Bold').text('Información del Cliente', { underline: true });
    doc.font('Helvetica').fontSize(9);
    doc.text(invoice.client_name || 'N/A');
    if (invoice.business_name) doc.text(`Empresa: ${invoice.business_name}`);
    if (invoice.tax_id) doc.text(`RUC/Cédula: ${invoice.tax_id}`);
    if (invoice.email) doc.text(`Email: ${invoice.email}`);
    if (invoice.phone) doc.text(`Teléfono: ${invoice.phone}`);
    if (invoice.address) doc.text(`Dirección: ${invoice.address}`);
    doc.moveDown();

    doc.fontSize(9).font('Helvetica-Bold').text('Detalles de la Factura');
    doc.text(`Fecha: ${new Date(invoice.issue_date).toLocaleDateString('es-ES')}`);
    if (invoice.due_date) {
      doc.text(`Vencimiento: ${new Date(invoice.due_date).toLocaleDateString('es-ES')}`);
    }
    doc.moveDown();

    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 250;
    const col3 = 360;
    const col4 = 450;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Descripción', col1, tableTop);
    doc.text('Cantidad', col2, tableTop);
    doc.text('Precio Unit.', col3, tableTop);
    doc.text('Total', col4, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica').fontSize(9);
    let position = tableTop + 25;

    items.forEach(item => {
      doc.text(item.description.substring(0, 30), col1, position);
      doc.text(item.quantity.toString(), col2, position);
      doc.text(`$${item.unit_price.toFixed(2)}`, col3, position);
      doc.text(`$${item.amount.toFixed(2)}`, col4, position);
      position += 20;
    });

    doc.moveTo(40, position).lineTo(550, position).stroke();
    position += 10;

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Subtotal:', col3, position);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, col4, position);
    position += 20;

    doc.text('IVA (13%):', col3, position);
    doc.text(`$${invoice.tax.toFixed(2)}`, col4, position);
    position += 20;

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('TOTAL:', col3, position);
    doc.text(`$${invoice.total.toFixed(2)}`, col4, position);

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

router.delete('/:id', async (req, res) => {
  try {
    const result = await run('DELETE FROM invoices WHERE id = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
