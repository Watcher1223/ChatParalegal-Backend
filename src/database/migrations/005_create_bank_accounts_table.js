exports.up = function(knex) {
  return knex.schema.createTable('bank_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
    table.string('bank_provider').notNullable(); // mercury, etc.
    table.string('external_account_id'); // ID from bank provider
    table.string('account_number'); // Masked account number
    table.string('routing_number');
    table.string('account_type').defaultTo('checking'); // checking, savings
    table.string('status').defaultTo('pending');
    table.jsonb('account_details'); // Additional account information
    table.jsonb('kyc_data'); // KYC information sent to bank
    table.timestamp('submitted_at');
    table.timestamp('approved_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['company_id']);
    table.index(['status']);
    table.index(['bank_provider']);
    table.index(['external_account_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bank_accounts');
}; 