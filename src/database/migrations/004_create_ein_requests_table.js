exports.up = function(knex) {
  return knex.schema.createTable('ein_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
    table.string('ein_number'); // Once issued
    table.string('status').defaultTo('pending');
    table.jsonb('request_data'); // Data sent to IRS/partner API
    table.jsonb('response_data'); // Response from IRS/partner API
    table.string('ein_letter_url'); // URL to EIN confirmation letter
    table.timestamp('submitted_at');
    table.timestamp('issued_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['company_id']);
    table.index(['status']);
    table.index(['ein_number']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ein_requests');
}; 