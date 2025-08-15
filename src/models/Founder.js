const db = require('../database/connection');
const logger = require('../utils/logger');

class Founder {
  static async create(founderData) {
    try {
      const [founder] = await db('founders')
        .insert(founderData)
        .returning('*');
      
      logger.info(`Founder created: ${founder.legal_name}`);
      return founder;
    } catch (error) {
      logger.error('Error creating founder:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const founder = await db('founders')
        .where({ id })
        .first();
      
      return founder;
    } catch (error) {
      logger.error('Error finding founder by ID:', error);
      throw error;
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const founders = await db('founders')
        .where({ company_id: companyId })
        .orderBy('created_at', 'asc');
      
      return founders;
    } catch (error) {
      logger.error('Error finding founders by company ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [founder] = await db('founders')
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`Founder ${id} updated successfully`);
      return founder;
    } catch (error) {
      logger.error('Error updating founder:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db('founders')
        .where({ id })
        .del();
      
      logger.info(`Founder ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error('Error deleting founder:', error);
      throw error;
    }
  }
}

module.exports = Founder; 