require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── IN-MEMORY DATA ────────────────────────────────────────────────────────────

let clients = [
  { id: 1,  name: 'CBP Endless Ventures',  email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 2,  name: 'Maria Caldera',         email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 3,  name: 'Zoila Camacho',         email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 4,  name: 'Marizol Benavidez',     email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 5,  name: 'Jorge Beltran',         email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 6,  name: 'Samuel Martinez',       email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 7,  name: 'Christopher Hernandez', email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 8,  name: 'Nabor Saldivar',        email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 9,  name: 'Kimberly Baker',        email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 10, name: 'Luis de Leon',          email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 11, name: 'Claudia Ortega',        email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 12, name: 'Roofing & Siding Pro',  email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 13, name: 'Carniceria La Ideal',   email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 14, name: 'Ana Tovar',             email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 15, name: 'Nails Premium Studio',  email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 16, name: 'Abel Huerta',           email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 17, name: 'Alondra Dental Co',     email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 18, name: 'Oscar Martinez',             email: '', phone: '', company: '', address: '', created_at: '2024-01-01' },
  { id: 19, name: 'CBP Construction, Inc.',     email: '', phone: '', company: '', address: '', created_at: '2024-12-16' },
  { id: 20, name: 'Albert Briseno',             email: '', phone: '', company: '', address: '', created_at: '2025-01-08' },
  { id: 21, name: 'Rene Gallegos',              email: '', phone: '', company: '', address: '', created_at: '2025-01-09' },
  { id: 22, name: 'Hammers Down Construction',  email: '', phone: '', company: '', address: '', created_at: '2025-01-14' },
  { id: 23, name: 'Mobile Check Deposit',       email: '', phone: '', company: '', address: '', created_at: '2025-01-21' },
  { id: 24, name: 'Alejandra Ramos',            email: '', phone: '', company: '', address: '', created_at: '2025-03-04' },
];

let invoices = [
  { id: 2,  client_name: 'CBP Endless Ventures',  issue_date: '2024-02-26', due_date: '2024-03-26', status: 'paid', total: 700.00,   notes: 'Invoice #2 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 3,  client_name: 'CBP Endless Ventures',  issue_date: '2024-03-16', due_date: '2024-04-16', status: 'paid', total: 150.00,   notes: 'Invoice #3 | Payment', items: [{description:'Servicios', quantity:1, unit_price:150}] },
  { id: 4,  client_name: 'CBP Endless Ventures',  issue_date: '2024-03-24', due_date: '2024-04-24', status: 'paid', total: 700.00,   notes: 'Invoice #4 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 5,  client_name: 'CBP Endless Ventures',  issue_date: '2024-04-26', due_date: '2024-05-26', status: 'paid', total: 700.00,   notes: 'Invoice #5 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 6,  client_name: 'Zoila Camacho',         issue_date: '2024-05-13', due_date: '2024-06-13', status: 'paid', total: 50.00,    notes: 'Invoice #6 | Payment', items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 7,  client_name: 'Marizol Benavidez',     issue_date: '2024-05-28', due_date: '2024-06-28', status: 'paid', total: 50.00,    notes: 'Invoice #7 | Payment', items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 8,  client_name: 'CBP Endless Ventures',  issue_date: '2024-06-03', due_date: '2024-07-03', status: 'paid', total: 700.00,   notes: 'Invoice #8 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 9,  client_name: 'CBP Endless Ventures',  issue_date: '2024-06-28', due_date: '2024-07-28', status: 'paid', total: 700.00,   notes: 'Invoice #9 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 10, client_name: 'Maria Caldera',         issue_date: '2024-07-16', due_date: '2024-08-16', status: 'paid', total: 20.00,    notes: 'Invoice #10 | Payment', items: [{description:'Servicios', quantity:1, unit_price:20}] },
  { id: 16, client_name: 'Maria Caldera',         issue_date: '2024-07-19', due_date: '2024-08-19', status: 'paid', total: 20.00,    notes: 'Invoice #16 | Payment', items: [{description:'Servicios', quantity:1, unit_price:20}] },
  { id: 17, client_name: 'Jorge Beltran',         issue_date: '2024-07-23', due_date: '2024-08-23', status: 'paid', total: 30.00,    notes: 'Invoice #17 | Payment', items: [{description:'Servicios', quantity:1, unit_price:30}] },
  { id: 18, client_name: 'Samuel Martinez',       issue_date: '2024-07-24', due_date: '2024-08-24', status: 'paid', total: 50.00,    notes: 'Invoice #18 | Payment', items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 19, client_name: 'Christopher Hernandez', issue_date: '2024-07-26', due_date: '2024-08-26', status: 'paid', total: 100.00,   notes: 'Invoice #19 | Payment', items: [{description:'Servicios', quantity:1, unit_price:100}] },
  { id: 20, client_name: 'Nabor Saldivar',        issue_date: '2024-08-01', due_date: '2024-09-01', status: 'paid', total: 90.00,    notes: 'Invoice #20 | Payment', items: [{description:'Servicios', quantity:1, unit_price:90}] },
  { id: 21, client_name: 'Kimberly Baker',        issue_date: '2024-08-05', due_date: '2024-09-05', status: 'paid', total: 40.00,    notes: 'Invoice #21 | Payment', items: [{description:'Servicios', quantity:1, unit_price:40}] },
  { id: 22, client_name: 'Nabor Saldivar',        issue_date: '2024-08-21', due_date: '2024-09-21', status: 'paid', total: 400.00,   notes: 'Invoice #22 | Payment', items: [{description:'Servicios', quantity:1, unit_price:400}] },
  { id: 23, client_name: 'Luis de Leon',          issue_date: '2024-08-14', due_date: '2024-09-14', status: 'paid', total: 50.00,    notes: 'Invoice #23 | Payment', items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 24, client_name: 'Claudia Ortega',        issue_date: '2024-08-30', due_date: '2024-09-30', status: 'paid', total: 400.00,   notes: 'Invoice #24 | Payment', items: [{description:'Servicios', quantity:1, unit_price:400}] },
  { id: 27, client_name: 'Roofing & Siding Pro',  issue_date: '2024-09-10', due_date: '2024-10-10', status: 'paid', total: 30.00,    notes: 'Invoice #27 | Payment', items: [{description:'Servicios', quantity:1, unit_price:30}] },
  { id: 28, client_name: 'Christopher Hernandez', issue_date: '2024-09-21', due_date: '2024-10-21', status: 'paid', total: 10.00,    notes: 'Invoice #28 | Payment', items: [{description:'Servicios', quantity:1, unit_price:10}] },
  { id: 29, client_name: 'CBP Endless Ventures',  issue_date: '2024-09-26', due_date: '2024-10-26', status: 'paid', total: 1500.00,  notes: 'Invoice #29 | Payment', items: [{description:'Servicios', quantity:1, unit_price:1500}] },
  { id: 30, client_name: 'Nabor Saldivar',        issue_date: '2024-10-04', due_date: '2024-11-04', status: 'paid', total: 20.00,    notes: 'Invoice #30 | Payment', items: [{description:'Servicios', quantity:1, unit_price:20}] },
  { id: 31, client_name: 'CBP Endless Ventures',  issue_date: '2024-10-07', due_date: '2024-11-07', status: 'paid', total: 800.00,   notes: 'Invoice #31 | Payment', items: [{description:'Servicios', quantity:1, unit_price:800}] },
  { id: 32, client_name: 'Zoila Camacho',         issue_date: '2024-10-19', due_date: '2024-11-19', status: 'paid', total: 12.00,    notes: 'Invoice #32 | Payment', items: [{description:'Servicios', quantity:1, unit_price:12}] },
  { id: 33, client_name: 'CBP Endless Ventures',  issue_date: '2024-10-21', due_date: '2024-11-21', status: 'paid', total: 1500.00,  notes: 'Invoice #33 | Payment', items: [{description:'Servicios', quantity:1, unit_price:1500}] },
  { id: 34, client_name: 'Carniceria La Ideal',   issue_date: '2024-10-31', due_date: '2024-11-30', status: 'paid', total: 30.00,    notes: 'Invoice #34 | Payment', items: [{description:'Servicios', quantity:1, unit_price:30}] },
  { id: 35, client_name: 'Ana Tovar',             issue_date: '2024-11-04', due_date: '2024-12-04', status: 'paid', total: 20.00,    notes: 'Invoice #35 | Payment', items: [{description:'Servicios', quantity:1, unit_price:20}] },
  { id: 36, client_name: 'CBP Endless Ventures',  issue_date: '2024-11-07', due_date: '2024-12-07', status: 'paid', total: 1000.00,  notes: 'Invoice #36 | Payment', items: [{description:'Servicios', quantity:1, unit_price:1000}] },
  { id: 37, client_name: 'Nails Premium Studio',  issue_date: '2024-11-14', due_date: '2024-12-14', status: 'paid', total: 700.00,   notes: 'Invoice #37 | Payment', items: [{description:'Servicios', quantity:1, unit_price:700}] },
  { id: 38, client_name: 'CBP Endless Ventures',  issue_date: '2024-11-20', due_date: '2024-12-20', status: 'paid', total: 1000.00,  notes: 'Invoice #38 | Payment', items: [{description:'Servicios', quantity:1, unit_price:1000}] },
  { id: 39, client_name: 'Abel Huerta',           issue_date: '2024-11-25', due_date: '2024-12-25', status: 'paid', total: 1200.00,  notes: 'Invoice #39 | Payment', items: [{description:'Servicios', quantity:1, unit_price:1200}] },
  { id: 40, client_name: 'Alondra Dental Co',     issue_date: '2024-12-06', due_date: '2025-01-06', status: 'paid', total: 500.00,   notes: 'Invoice #40 | Payment', items: [{description:'Servicios', quantity:1, unit_price:500}] },
  { id: 41, client_name: 'Oscar Martinez',            issue_date: '2024-12-07', due_date: '2025-01-07', status: 'paid', total: 175.00,   notes: 'Invoice #41 | Payment - Zelle',  items: [{description:'Servicios', quantity:1, unit_price:175}] },
  { id: 42, client_name: 'Oscar Martinez',            issue_date: '2024-12-12', due_date: '2025-01-12', status: 'paid', total: 175.00,   notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:175}] },
  { id: 43, client_name: 'CBP Construction, Inc.',   issue_date: '2024-12-16', due_date: '2025-01-16', status: 'paid', total: 5.00,     notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:5}] },
  { id: 44, client_name: 'CBP Construction, Inc.',   issue_date: '2024-12-16', due_date: '2025-01-16', status: 'paid', total: 1200.00,  notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:1200}] },
  { id: 45, client_name: 'Zoila Camacho',            issue_date: '2024-12-23', due_date: '2025-01-23', status: 'paid', total: 50.00,    notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 46, client_name: 'Albert Briseno',           issue_date: '2025-01-08', due_date: '2025-02-08', status: 'paid', total: 1200.00,  notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:1200}] },
  { id: 47, client_name: 'Rene Gallegos',            issue_date: '2025-01-09', due_date: '2025-02-09', status: 'paid', total: 1100.00,  notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:1100}] },
  { id: 48, client_name: 'Hammers Down Construction',issue_date: '2025-01-14', due_date: '2025-02-14', status: 'paid', total: 50.00,    notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:50}] },
  { id: 49, client_name: 'Mobile Check Deposit',     issue_date: '2025-01-21', due_date: '2025-02-21', status: 'paid', total: 1200.00,  notes: 'Cheque',                        items: [{description:'Servicios', quantity:1, unit_price:1200}] },
  { id: 50, client_name: 'Mobile Check Deposit',     issue_date: '2025-02-24', due_date: '2025-03-24', status: 'paid', total: 1200.00,  notes: 'Cheque',                        items: [{description:'Servicios', quantity:1, unit_price:1200}] },
  { id: 51, client_name: 'Alejandra Ramos',          issue_date: '2025-03-04', due_date: '2025-04-04', status: 'paid', total: 200.00,   notes: 'Zelle',                         items: [{description:'Servicios', quantity:1, unit_price:200}] },
];

let nextClientId = 25;
let nextInvoiceId = 52;

// ── HELPERS ───────────────────────────────────────────────────────────────────

function computeDashboard() {
  const revenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const byMonth = {};
  invoices.forEach(inv => {
    if (!inv.issue_date) return;
    const [y, m] = inv.issue_date.split('-');
    const key = `${y}-${m}`;
    byMonth[key] = (byMonth[key] || 0) + inv.total;
  });
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const monthlyRevenue = Object.entries(byMonth)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([k, total]) => {
      const [y, m] = k.split('-');
      return { month: `${months[parseInt(m)-1]} ${y}`, total };
    });
  return {
    totalInvoices: invoices.length,
    totalClients: clients.length,
    pendingInvoices: invoices.filter(i => i.status === 'pending').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    cancelledInvoices: invoices.filter(i => i.status === 'cancelled').length,
    revenue,
    monthlyRevenue
  };
}

// ── STATIC FILES ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'views')));

// ── VIEWS ─────────────────────────────────────────────────────────────────────
app.get('/accounting/login',     (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));
app.get('/accounting/dashboard', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html')));
app.get('/accounting/clients',   (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'clients.html')));
app.get('/accounting/invoices',  (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'invoices.html')));
app.get('/accounting/reports',   (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'reports.html')));

// ── AUTH ──────────────────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'jojulioneto1@gmail.com' && password === 'Julioolivo94@') {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});
app.post('/api/auth/logout', (req, res) => res.json({ success: true }));
app.get('/api/auth/me', (req, res) => res.json({ email: 'jojulioneto1@gmail.com', name: 'Admin' }));

// ── CLIENTS ───────────────────────────────────────────────────────────────────
app.get('/api/clients', (req, res) => {
  res.json([...clients].sort((a, b) => a.name.localeCompare(b.name)));
});

app.post('/api/clients', (req, res) => {
  const { name, email, phone, company, address } = req.body;
  if (!name) return res.status(400).json({ error: 'Nombre requerido' });
  const exists = clients.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Cliente ya existe', client: exists });
  const client = { id: nextClientId++, name, email: email||'', phone: phone||'', company: company||'', address: address||'', created_at: new Date().toISOString().split('T')[0] };
  clients.push(client);
  res.status(201).json(client);
});

app.delete('/api/clients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  clients = clients.filter(c => c.id !== id);
  res.json({ success: true });
});

// ── INVOICES ──────────────────────────────────────────────────────────────────
app.get('/api/invoices', (req, res) => {
  res.json([...invoices].sort((a, b) => b.id - a.id));
});

app.post('/api/invoices', (req, res) => {
  const { client_name, status, issue_date, due_date, notes, items, total } = req.body;
  if (!client_name) return res.status(400).json({ error: 'Cliente requerido' });
  const invoice = { id: nextInvoiceId++, client_name, status: status||'pending', issue_date, due_date, notes: notes||'', items: items||[], total: parseFloat(total)||0 };
  invoices.push(invoice);
  res.status(201).json(invoice);
});

app.delete('/api/invoices/:id', (req, res) => {
  const id = parseInt(req.params.id);
  invoices = invoices.filter(i => i.id !== id);
  res.json({ success: true });
});

app.get('/api/invoices/:id/pdf', (req, res) => {
  const inv = invoices.find(i => i.id === parseInt(req.params.id));
  if (!inv) return res.status(404).json({ error: 'Factura no encontrada' });
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Factura #${String(inv.id).padStart(4,'0')}</title>
  <style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#111}h1{color:#2563eb}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}.info{margin-bottom:24px}table{width:100%;border-collapse:collapse;margin-bottom:24px}th{background:#f3f4f6;padding:10px;text-align:left;font-size:13px}td{padding:10px;border-bottom:1px solid #e5e7eb;font-size:13px}.total{text-align:right;font-size:1.1rem;font-weight:700;color:#2563eb}.badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;background:#d1fae5;color:#065f46}</style>
  </head><body>
  <div class="header"><div><h1>Financial Innovation</h1><p style="color:#666">Sistema de Contabilidad</p></div><div style="text-align:right"><h2>FACTURA</h2><p style="color:#2563eb;font-size:1.2rem">#${String(inv.id).padStart(4,'0')}</p><span class="badge">${inv.status==='paid'?'Pagada':inv.status==='pending'?'Pendiente':'Cancelada'}</span></div></div>
  <div class="info"><p><strong>Cliente:</strong> ${inv.client_name}</p><p><strong>Fecha emisión:</strong> ${inv.issue_date||'—'}</p><p><strong>Fecha vencimiento:</strong> ${inv.due_date||'—'}</p>${inv.notes?`<p><strong>Notas:</strong> ${inv.notes}</p>`:''}</div>
  <table><thead><tr><th>Descripción</th><th>Qty</th><th>Precio</th><th>Total</th></tr></thead><tbody>
  ${(inv.items||[]).map(it=>`<tr><td>${it.description||''}</td><td>${it.quantity||1}</td><td>$${parseFloat(it.unit_price||0).toFixed(2)}</td><td>$${(it.quantity*it.unit_price).toFixed(2)}</td></tr>`).join('')}
  </tbody></table>
  <div class="total">Total: $${inv.total.toFixed(2)}</div>
  <script>window.print();</script></body></html>`);
});

// ── REPORTS ───────────────────────────────────────────────────────────────────
app.get('/api/reports/dashboard', (req, res) => res.json(computeDashboard()));

// ── DEFAULT ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

module.exports = app;
