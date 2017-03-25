const express = require('express');

const router = express.Router();
const queries = require('../db/queries.js');

/*
get all jobs
 */
router.get('/', (req, res, next) => {
  return queries.getAllJobs()
  .then((jobs) => {
    res.json({
      status: 'success',
      data: jobs,
    });
  })
  .catch((err) => { return next(err); });
});

/*
get single job
 */
router.get('/:id', (req, res, next) => {
  return queries.getSingleJob(parseInt(req.params.id, 10))
  .then((jobs) => {
    res.json({
      status: 'success',
      data: jobs[0],
    });
  })
  .catch((err) => { return next(err); });
});


/*
add new job
 */
router.post('/', (req, res, next) => {
  return queries.addJob(req.body)
  .then(() => {
    res.json({
      status: 'success',
      data: 'Job Added!',
    });
  })
  .catch((err) => { return next(err); });
});


/*
update job
 */
router.put('/:id', (req, res, next) => {
  return queries.updateJob(parseInt(req.params.id, 10), req.body)
  .then(() => {
    res.json({
      status: 'success',
      data: 'Job Updated!',
    });
  })
  .catch((err) => { return next(err); });
});

/*
delete job
 */
router.delete('/:id', (req, res, next) => {
  return queries.removeJob(parseInt(req.params.id, 10))
  .then(() => {
    res.json({
      status: 'success',
      data: 'Job Removed!',
    });
  })
  .catch((err) => { return next(err); });
});


module.exports = router;
