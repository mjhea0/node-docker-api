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

module.exports = {
  getWeather,
};
