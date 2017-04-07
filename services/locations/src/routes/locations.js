const express = require('express');
const queries = require('../model/queries.js');
const authHelpers = require('../auth/_helpers');

const router = express.Router();

/*
get all locations
 */
router.get('/', authHelpers.ensureAuthenticated, (req, res, next) => {
  return queries.getAllLocations()
  .then((locations) => {
    res.json({
      status: 'success',
      data: locations,
    });
  })
  .catch((err) => { return next(err); });
});

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
