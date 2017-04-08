function ensureAuthenticated(req, res, next) {
  if (!req.session.token) return res.redirect('/login');
  return next();
}

module.exports = {
  ensureAuthenticated,
};
