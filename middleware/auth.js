function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/accounting/login');
  }
}

function isNotAuthenticated(req, res, next) {
  if (!req.session || !req.session.user) {
    next();
  } else {
    res.redirect('/accounting/dashboard');
  }
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated
};
