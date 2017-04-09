function ensureAuthenticated(req, res, next) {
  if (!req.session.token) return res.redirect('/login');
  return next();
}

function loginRedirect(req, res, next) {
  if (req.session.token) return res.redirect('/');
  return next();
}

module.exports = {
  ensureAuthenticated,
  loginRedirect,
};
