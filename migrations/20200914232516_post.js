
exports.up = function(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments();
    table.string('title').notNullable();
    table.text('text');
    table.boolean('deleted').defaultTo(false);
    table.integer('user_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('user_id').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts');
};
