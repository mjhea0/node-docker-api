exports.seed = (knex, Promise) => {
  return knex('locations').del()
  .then(() => {
    return Promise.join(
      knex('locations').insert({
        user_id: 1,
        lat: 40.014986,
        long: -105.270546,
      })  // eslint-disable-line
    );
  })
  .catch((err) => { console.log(err); });
};
