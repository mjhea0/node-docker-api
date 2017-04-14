const moment = require('moment');
const jwt = require('jwt-simple');
const knex = require('../db/connection');

function decodeToken(token, callback) {
  const payload = jwt.decode(token, process.env.TOKEN_SECRET);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp) callback('Token has expired.');
  else callback(null, payload);
}

/* eslint-disable consistent-return */
function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({
      status: 'Please log in',
    });
  }
  // decode the token
  const header = req.headers.authorization.split(' ');
  const token = header[1];
  return decodeToken(token, (err, payload) => {
    if (err) {
      return res.status(401).json({
        status: 'Token has expired',
      });
    }
    return knex('users').where({ id: parseInt(payload.sub, 10) }).first()
    .then((user) => {
      req.user = user;
      return next();
    })
    .catch(() => {
      return res.status(500).json({
        status: 'error',
      });
    });
  });
}
/* eslint-enable consistent-return */

module.exports = {
  ensureAuthenticated,
};
