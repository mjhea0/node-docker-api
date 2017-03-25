exports.up = (knex) => {
  return knex.schema.createTable('jobs', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.string('company').notNullable();
    table.string('description').notNullable();
    table.string('email').notNullable();
    table.boolean('contacted').notNullable().defaultTo(false);
    table.timestamps(true, true); // => timstamp, defaultTo current
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('jobs');
};
