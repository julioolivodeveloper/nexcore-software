function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    // Para APIs, devolver error JSON; para HTML, redirigir
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    res.redirect('/accounting/login');
  }
}

function isNotAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    next();
  } else {
    // Para APIs, devolver error JSON; para HTML, redirigir
    if (req.path.startsWith('/api/')) {
      return res.status(200).json({ success: true, message: 'Ya autenticado' });
    }
    res.redirect('/accounting/dashboard');
  }
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};
