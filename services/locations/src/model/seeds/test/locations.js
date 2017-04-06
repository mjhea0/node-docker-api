const bcrypt = require('bcryptjs');

exports.seed = (knex, Promise) => {
  return knex('users').del()
  .then(() => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync('johnson123', salt);
    return knex('users')
    .insert({
      username: 'jeremy',
      password: hash,
    })
    .returning('*');
  })
  .then((res) => {
    return knex('locations').del()
    .then(() => {
      return Promise.join(
        knex('locations').insert({
          user_id: res[0].id,
          lat: 40.014986,
          long: -105.270546,
        })  // eslint-disable-line
      );
    });
  });
};
