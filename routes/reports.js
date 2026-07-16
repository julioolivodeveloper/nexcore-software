const express = require('express');
const { getClient } = require('../db/database');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
router.use(isAuthenticated);

router.get('/dashboard', async (req, res) => {
  try {
    const sb = getClient();

    const [
      { count: totalInvoices },
      { count: totalClients },
      { count: pendingInvoices },
      { data: paidData },
      { data: monthlyData }
    ] = await Promise.all([
      sb.from('invoices').select('*', { count: 'exact', head: true }),
      sb.from('clients').select('*',  { count: 'exact', head: true }),
      sb.from('invoices').select('*', { count: 'exact', head: true }).neq('status', 'paid'),
      sb.from('invoices').select('total').eq('status', 'paid'),
      sb.from('invoices').select('issue_date, total').eq('status', 'paid').order('issue_date', { ascending: false }).limit(500)
    ]);

    const revenue = (paidData || []).reduce((sum, i) => sum + (i.total || 0), 0);

    // Group by month in JS (avoids SQLite-specific strftime)
    const monthMap = {};
    (monthlyData || []).forEach(inv => {
      const month = inv.issue_date?.slice(0, 7);
      if (!month) return;
      monthMap[month] = (monthMap[month] || 0) + (inv.total || 0);
    });
    const monthlyRevenue = Object.entries(monthMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    res.json({ totalInvoices, totalClients, pendingInvoices, revenue, monthlyRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/invoices', async (req, res) => {
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

router.get('/clients/top', async (req, res) => {
  try {
    const sb = getClient();
    const { data: clients } = await sb.from('clients').select('id, name');
    const { data: invoices } = await sb.from('invoices').select('client_id, total');

    const map = {};
    (clients || []).forEach(c => { map[c.id] = { id: c.id, name: c.name, invoice_count: 0, total_spent: 0 }; });
    (invoices || []).forEach(i => {
      if (map[i.client_id]) {
        map[i.client_id].invoice_count++;
        map[i.client_id].total_spent += i.total || 0;
      }
    });

    const topClients = Object.values(map)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

    res.json(topClients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const { data, error } = await getClient()
      .from('invoices')
      .select('issue_date, subtotal, tax, total')
      .eq('status', 'paid')
      .order('issue_date', { ascending: false })
      .limit(1000);

    if (error) throw error;

    const map = {};
    (data || []).forEach(inv => {
      let key;
      const d = inv.issue_date?.slice(0, 10);
      if (!d) return;
      if (period === 'day')   key = d;
      else if (period === 'year') key = d.slice(0, 4);
      else                    key = d.slice(0, 7);

      if (!map[key]) map[key] = { period: key, invoice_count: 0, subtotal: 0, tax: 0, total: 0 };
      map[key].invoice_count++;
      map[key].subtotal += inv.subtotal || 0;
      map[key].tax      += inv.tax      || 0;
      map[key].total    += inv.total    || 0;
    });

    const revenue = Object.values(map).sort((a, b) => b.period.localeCompare(a.period));
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
