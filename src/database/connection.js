const knex = require('knex');
const config = require('../../knexfile');
const logger = require('../utils/logger');

// For mock mode, we don't need a real database connection
// This prevents deployment crashes when no database is configured
if (process.env.NODE_ENV === 'production' && !process.env.DB_HOST) {
  logger.info('🚧 Mock mode detected - skipping database connection');
  module.exports = null;
  return;
}

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Only create connection if we have database config
if (dbConfig && dbConfig.connection && dbConfig.connection.host) {
  const db = knex(dbConfig);

  // Test database connection
  db.raw('SELECT 1')
    .then(() => {
      logger.info('✅ Database connected successfully');
    })
    .catch((error) => {
      logger.warn('⚠️ Database connection failed (continuing in mock mode):', error.message);
    });

  module.exports = db;
} else {
  logger.info('🚧 No database configuration found - running in mock mode');
  module.exports = null;
} 