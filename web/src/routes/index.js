const express = require('express');
const request = require('request-promise');
const helpers = require('./_helpers');

const router = express.Router();

/*
- login
- register
- main (weather page)
- user page (search history)
 */

router.get('/', helpers.ensureAuthenticated, (req, res) => {
  res.render('main.html', { user: req.user });
});

router.get('/login', (req, res) => {
  res.render('login.html');
});

router.post('/login', (req, res) => {
  res.send('test');
});

router.get('/register', (req, res) => {
  res.render('register.html');
});

router.post('/register', (req, res) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
  };
  const options = {
    method: 'POST',
    uri: 'http://users-service:3000/users/register',
    body: payload,
    json: true,
  };
  return request(options)
  .then((response) => {
    req.session.token = response.token;
    res.redirect('/');
  })
  .catch((err) => { console.log(err); });
});

router.get('/user', helpers.ensureAuthenticated, (req, res) => {
  res.send('hi');
});

module.exports = router;
