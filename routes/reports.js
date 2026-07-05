const express = require('express');
const { all, get } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.use(isAuthenticated);

router.get('/dashboard', async (req, res) => {
  try {
    const totalInvoices = await get('SELECT COUNT(*) as count FROM invoices');
    const totalClients = await get('SELECT COUNT(*) as count FROM clients');
    const pendingInvoices = await get('SELECT COUNT(*) as count FROM invoices WHERE status != "paid"');

    const revenue = await get(`
      SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE status = 'paid'
    `);

    const monthlyRevenue = await all(`
      SELECT
        strftime('%Y-%m', issue_date) as month,
        SUM(total) as total
      FROM invoices
      WHERE status = 'paid'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `);

    res.json({
      totalInvoices: totalInvoices.count,
      totalClients: totalClients.count,
      pendingInvoices: pendingInvoices.count,
      revenue: revenue.total,
      monthlyRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const invoices = await all(`
      SELECT
        i.*,
        c.name as client_name
      FROM invoices i
      LEFT JOIN clients c ON i.client_id = c.id
      ORDER BY i.issue_date DESC
    `);

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/clients/top', async (req, res) => {
  try {
    const topClients = await all(`
      SELECT
        c.id,
        c.name,
        COUNT(i.id) as invoice_count,
        COALESCE(SUM(i.total), 0) as total_spent
      FROM clients c
      LEFT JOIN invoices i ON c.id = i.client_id
      GROUP BY c.id
      ORDER BY total_spent DESC
      LIMIT 10
    `);

    res.json(topClients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const period = req.query.period || 'month';
    let groupBy = 'strftime("%Y-%m", issue_date)';

    if (period === 'year') {
      groupBy = 'strftime("%Y", issue_date)';
    } else if (period === 'day') {
      groupBy = 'DATE(issue_date)';
    }

    const revenue = await all(`
      SELECT
        ${groupBy} as period,
        COUNT(*) as invoice_count,
        COALESCE(SUM(subtotal), 0) as subtotal,
        COALESCE(SUM(tax), 0) as tax,
        COALESCE(SUM(total), 0) as total
      FROM invoices
      WHERE status = 'paid'
      GROUP BY period
      ORDER BY period DESC
    `);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
