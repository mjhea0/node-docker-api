const knex = require('./connection');

function getAllLocations() {
  return knex('locations').select();
}

function getSingleLocation(locationId) {
  return knex('locations').select().where('id', locationId);
}

function addLocation(obj) {
  return knex('locations').insert(obj);
}

function updateLocation(locationId, obj) {
  return knex('locations').update(obj).where('id', locationId);
}

function removeLocation(locationId) {
  return knex('locations').del().where('id', locationId);
}

module.exports = {
  getAllLocations,
  getSingleLocation,
  addLocation,
  updateLocation,
  removeLocation,
};
