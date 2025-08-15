const db = require('../database/connection');
const logger = require('../utils/logger');

class IncorporationRequest {
  static async create(requestData) {
    try {
      const [request] = await db('incorporation_requests')
        .insert(requestData)
        .returning('*');
      
      logger.info(`Incorporation request created: ${request.id}`);
      return request;
    } catch (error) {
      logger.error('Error creating incorporation request:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const request = await db('incorporation_requests')
        .where({ id })
        .first();
      
      return request;
    } catch (error) {
      logger.error('Error finding incorporation request by ID:', error);
      throw error;
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const requests = await db('incorporation_requests')
        .where({ company_id: companyId })
        .orderBy('created_at', 'desc');
      
      return requests;
    } catch (error) {
      logger.error('Error finding incorporation requests by company ID:', error);
      throw error;
    }
  }

  static async findByExternalId(externalId) {
    try {
      const request = await db('incorporation_requests')
        .where({ external_request_id: externalId })
        .first();
      
      return request;
    } catch (error) {
      logger.error('Error finding incorporation request by external ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [request] = await db('incorporation_requests')
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`Incorporation request ${id} updated successfully`);
      return request;
    } catch (error) {
      logger.error('Error updating incorporation request:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db('incorporation_requests')
        .where({ id })
        .del();
      
      logger.info(`Incorporation request ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error('Error deleting incorporation request:', error);
      throw error;
    }
  }
}

module.exports = IncorporationRequest; 