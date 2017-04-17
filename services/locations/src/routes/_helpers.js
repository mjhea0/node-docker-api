const request = require('request-promise');

const BASE = 'http://api.openweathermap.org/data/2.5/weather';
const KEY = process.env.OPENWEATHERMAP_API_KEY;

function getWeather(locationsArray) {
  const data = locationsArray.map((location) => {
    const options = {
      method: 'GET',
      uri: `${BASE}?lat=${location.lat}&lon=${location.long}&appid=${KEY}`,
      json: true,
    };
    return request(options);
  });
  return Promise.all(data);
}

function ensureAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).json({ status: 'Please log in', });
  }
  const options = {
    method: 'GET',
    uri: 'http://users-service:3000/users/user',
    json: true,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`,
    },
  };
  return request(options)
  .then((response) => {
    req.user = response.user;
    return next(); })
  .catch((err) => { return next(err); });
}

module.exports = {
  getWeather,
  ensureAuthenticated,
};
