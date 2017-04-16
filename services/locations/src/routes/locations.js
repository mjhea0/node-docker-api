const express = require('express');
const queries = require('../db/queries.js');
const routeHelpers = require('./_helpers');

const router = express.Router();

router.get('/ping', (req, res) => {
  res.send('pong');
});

/*
get all locations
 */
/* eslint-disable no-param-reassign */
router.get('/', routeHelpers.ensureAuthenticated, (req, res, next) => {
  let allLocations = [];
  return queries.getAllLocations()
  .then((locations) => {
    allLocations = locations;
    return routeHelpers.getWeather(allLocations);
  })
  .then((weather) => {
    const final = allLocations.map((location, i) => {
      const convert = (parseFloat(weather[i].main.temp, 10) * (9 / 5)) - 459.67;
      location.temp = Math.round(convert);
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
get locations by user
 */
/* eslint-disable no-param-reassign */
router.get('/user', routeHelpers.ensureAuthenticated, (req, res, next) => {
  let allLocations = [];
  return queries.getAllLocationsByUser(parseInt(req.user, 10))
  .then((locations) => {
    allLocations = locations;
    return routeHelpers.getWeather(allLocations);
  })
  .then((weather) => {
    const final = allLocations.map((location, i) => {
      const convert = (parseFloat(weather[i].main.temp, 10) * (9 / 5)) - 459.67;
      location.temp = Math.round(convert);
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
router.get('/:id', routeHelpers.ensureAuthenticated, (req, res, next) => {
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
router.post('/', routeHelpers.ensureAuthenticated, (req, res, next) => {
  req.body.user_id = req.user;
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
router.put('/:id', routeHelpers.ensureAuthenticated, (req, res, next) => {
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
router.delete('/:id', routeHelpers.ensureAuthenticated, (req, res, next) => {
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
