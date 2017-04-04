const knex = require('./connection');

function getAllJobs() {
  return knex('jobs').select();
}

function getSingleJob(jobId) {
  return knex('jobs').select().where('id', jobId);
}

function addJob(obj) {
  return knex('jobs').insert(obj);
}

function updateJob(jobId, obj) {
  return knex('jobs').update(obj).where('id', jobId);
}

function removeJob(jobId) {
  return knex('jobs').del().where('id', jobId);
}

module.exports = {
  getAllJobs,
  getSingleJob,
  addJob,
  updateJob,
  removeJob,
};
