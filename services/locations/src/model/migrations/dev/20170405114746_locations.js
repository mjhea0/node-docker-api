exports.up = (knex) => {
  return knex.schema.createTable('locations', (table) => {
    table.increments();
    table.foreign('user_id').references('id').inTable('users');
    table.float('lat').notNullable();
    table.float('long').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('locations');
};
