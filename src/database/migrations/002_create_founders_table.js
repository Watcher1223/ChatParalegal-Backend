exports.up = function(knex) {
  return knex.schema.createTable('founders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('company_id').references('id').inTable('companies').onDelete('CASCADE');
    table.string('legal_name').notNullable();
    table.date('date_of_birth').notNullable();
    table.jsonb('address').notNullable();
    table.string('id_type'); // passport, driver_license, etc.
    table.string('id_number');
    table.string('id_front_image_url');
    table.string('id_back_image_url');
    table.string('selfie_image_url');
    table.boolean('kyc_verified').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Indexes
    table.index(['company_id']);
    table.index(['kyc_verified']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('founders');
}; 