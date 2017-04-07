const express = require('express');

const router = express.Router();

/*
- login
- register
- main (weather page)
- user page (search history)
 */

function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    res.redirect('/login');
  }
  // decode the token
  const header = req.headers.authorization.split(' ');
  const token = header[1];
  if (!token) {
    res.redirect('/login');
  }
  next();
}

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('main.html');
});

router.get('/login', (req, res) => {
  res.send('hi');
});

router.get('/register', (req, res) => {
  res.send('hi');
});

router.get('/user', ensureAuthenticated, (req, res) => {
  res.send('hi');
});

module.exports = router;
