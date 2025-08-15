exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('role').defaultTo('founder'); // founder, admin, staff
    table.uuid('company_id').references('id').inTable('companies');
    table.boolean('email_verified').defaultTo(false);
    table.string('verification_token');
    table.timestamp('verification_token_expires');
    table.string('reset_password_token');
    table.timestamp('reset_password_expires');
    table.timestamp('last_login');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['email']);
    table.index(['company_id']);
    table.index(['role']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}; 