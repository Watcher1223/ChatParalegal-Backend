exports.up = function(knex) {
  return knex.schema.createTable('companies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('company_name').notNullable();
    table.string('entity_type').notNullable(); // LLC, Corporation, etc.
    table.string('state').notNullable();
    table.string('status').defaultTo('pending_incorporation');
    table.jsonb('company_details');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['status']);
    table.index(['state']);
    table.index(['company_name']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('companies');
}; 