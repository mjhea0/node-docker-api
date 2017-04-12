const express = require('express');
const request = require('request-promise');
const helpers = require('./_helpers');

const router = express.Router();

/*
- login (get, post)
- register (get, post)
- logout (get)
- main/weather page (get)
- user page/search history (get)
 */

router.get('/', helpers.ensureAuthenticated, (req, res, next) => {
  let user = false;
  if (req.session.token) { user = true; }
  const options = {
    method: 'GET',
    uri: 'http://locations-service:3001/locations/',
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token}`,
    },
  };
  return request(options)
  .then((response) => {
    res.render('main.html', { user, locations: response.data });
  })
  .catch((err) => { next(err); });
});

router.get('/login', helpers.loginRedirect, (req, res) => {
  let user = false;
  if (req.session.token) { user = true; }
  res.render('login.html', { user });
});

router.post('/login', helpers.loginRedirect, (req, res, next) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
  };
  const options = {
    method: 'POST',
    uri: 'http://users-service:3000/users/login',
    body: payload,
    json: true,
  };
  return request(options)
  .then((response) => {
    req.session.token = response.token;
    res.redirect('/');
  })
  .catch((err) => { next(err); });
});

router.get('/register', helpers.loginRedirect, (req, res) => {
  let user = false;
  if (req.session.token) { user = true; }
  res.render('register.html', { user });
});

router.post('/register', (req, res, next) => {
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
  .catch((err) => { next(err); });
});

router.get('/logout', helpers.ensureAuthenticated, (req, res) => {
  req.session.token = null;
  res.redirect('/');
});

router.post('/add', helpers.ensureAuthenticated, (req, res, next) => {
  const payload = {
    lat: req.body.latitude,
    long: req.body.longitude,
  };
  const options = {
    method: 'POST',
    uri: 'http://locations-service:3001/locations/',
    json: true,
    body: payload,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token}`,
    },
  };
  return request(options)
  .then(() => {
    res.redirect('/');
  })
  .catch((err) => { next(err); });
});

router.get('/user', helpers.ensureAuthenticated, (req, res, next) => {
  let user = false;
  if (req.session.token) { user = true; }
  const options = {
    method: 'GET',
    uri: 'http://locations-service:3001/locations/user',
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.token}`,
    },
  };
  return request(options)
  .then((response) => {
    res.render('user.html', { user, locations: response.data });
  })
  .catch((err) => { next(err); });
});

module.exports = router;
