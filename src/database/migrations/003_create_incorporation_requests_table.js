exports.up = function(knex) {
  return knex.schema.createTable('incorporation_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
    table.string('formation_provider').notNullable(); // firstbase, clerky, zenbusiness
    table.string('external_request_id'); // ID from formation provider
    table.string('status').defaultTo('pending');
    table.jsonb('request_data'); // Data sent to formation provider
    table.jsonb('response_data'); // Response from formation provider
    table.string('articles_of_incorporation_url');
    table.string('formation_certificate_url');
    table.timestamp('submitted_at');
    table.timestamp('completed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['company_id']);
    table.index(['status']);
    table.index(['formation_provider']);
    table.index(['external_request_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('incorporation_requests');
}; 