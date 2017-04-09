const express = require('express');
const request = require('request-promise');
const queries = require('../model/queries.js');
const authHelpers = require('../auth/_helpers');

const BASE = 'http://api.openweathermap.org/data/2.5/weather';
const KEY = process.env.OPENWEATHERMAP_API_KEY;

const router = express.Router();

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

/*
get all locations
 */
/* eslint-disable no-param-reassign */
router.get('/', authHelpers.ensureAuthenticated, (req, res, next) => {
  let allLocations = [];
  return queries.getAllLocations()
  .then((locations) => {
    allLocations = locations;
    return getWeather(locations);
  })
  .then((weather) => {
    const final = allLocations.map((location) => {
      weather.forEach((el) => {
        const convert = (parseFloat(el.main.temp, 10) * (9 / 5)) - 459.67;
        location.temp = Math.round(convert);
      });
      return location;
    });
    res.json({
      status: 'success',
      data: final,
    });
  })
  .catch((err) => { return next(err); });
});
/* eslint-enable no-param-reassign */


/*
get single location
 */
router.get('/:id', authHelpers.ensureAuthenticated, (req, res, next) => {
  return queries.getSingleLocation(parseInt(req.params.id, 10))
  .then((locations) => {
    res.json({
      status: 'success',
      data: locations[0],
    });
  })
  .catch((err) => { return next(err); });
});


/*
add new location
 */
router.post('/', authHelpers.ensureAuthenticated, (req, res, next) => {
  req.body.user_id = req.user.id;
  return queries.addLocation(req.body)
  .then(() => {
    res.json({
      status: 'success',
      data: 'Location Added!',
    });
  })
  .catch((err) => { return next(err); });
});


/*
update location
 */
router.put('/:id', authHelpers.ensureAuthenticated, (req, res, next) => {
  req.body.user_id = req.user.id;
  return queries.updateLocation(parseInt(req.params.id, 10), req.body)
  .then(() => {
    res.json({
      status: 'success',
      data: 'Location Updated!',
    });
  })
  .catch((err) => { return next(err); });
});

/*
delete location
 */
router.delete('/:id', authHelpers.ensureAuthenticated, (req, res, next) => {
  return queries.removeLocation(parseInt(req.params.id, 10))
  .then(() => {
    res.json({
      status: 'success',
      data: 'Location Removed!',
    });
  })
  .catch((err) => { return next(err); });
});

module.exports = router;
