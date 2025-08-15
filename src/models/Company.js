const db = require('../database/connection');
const logger = require('../utils/logger');

class Company {
  static async create(companyData) {
    try {
      const [company] = await db('companies')
        .insert({
          company_name: companyData.company_name,
          entity_type: companyData.entity_type,
          state: companyData.state,
          company_details: companyData.company_details || {},
          status: 'pending_incorporation'
        })
        .returning('*');
      
      logger.info(`Company created: ${company.company_name}`);
      return company;
    } catch (error) {
      logger.error('Error creating company:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const company = await db('companies')
        .where({ id })
        .first();
      
      return company;
    } catch (error) {
      logger.error('Error finding company by ID:', error);
      throw error;
    }
  }

  static async findByStatus(status) {
    try {
      const companies = await db('companies')
        .where({ status })
        .orderBy('created_at', 'desc');
      
      return companies;
    } catch (error) {
      logger.error('Error finding companies by status:', error);
      throw error;
    }
  }

  static async updateStatus(id, status, additionalData = {}) {
    try {
      const [company] = await db('companies')
        .where({ id })
        .update({
          status,
          ...additionalData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`Company ${id} status updated to: ${status}`);
      return company;
    } catch (error) {
      logger.error('Error updating company status:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [company] = await db('companies')
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`Company ${id} updated successfully`);
      return company;
    } catch (error) {
      logger.error('Error updating company:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const companies = await db('companies')
        .orderBy('created_at', 'desc');
      
      return companies;
    } catch (error) {
      logger.error('Error getting all companies:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db('companies')
        .where({ id })
        .del();
      
      logger.info(`Company ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error('Error deleting company:', error);
      throw error;
    }
  }
}

module.exports = Company; 