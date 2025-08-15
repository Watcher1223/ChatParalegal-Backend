const db = require('../database/connection');
const logger = require('../utils/logger');

class EINRequest {
  static async create(requestData) {
    try {
      const [request] = await db('ein_requests')
        .insert(requestData)
        .returning('*');
      
      logger.info(`EIN request created: ${request.id}`);
      return request;
    } catch (error) {
      logger.error('Error creating EIN request:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const request = await db('ein_requests')
        .where({ id })
        .first();
      
      return request;
    } catch (error) {
      logger.error('Error finding EIN request by ID:', error);
      throw error;
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const requests = await db('ein_requests')
        .where({ company_id: companyId })
        .orderBy('created_at', 'desc');
      
      return requests;
    } catch (error) {
      logger.error('Error finding EIN requests by company ID:', error);
      throw error;
    }
  }

  static async findByExternalId(externalId) {
    try {
      const request = await db('ein_requests')
        .where({ external_request_id: externalId })
        .first();
      
      return request;
    } catch (error) {
      logger.error('Error finding EIN request by external ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [request] = await db('ein_requests')
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`EIN request ${id} updated successfully`);
      return request;
    } catch (error) {
      logger.error('Error updating EIN request:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db('ein_requests')
        .where({ id })
        .del();
      
      logger.info(`EIN request ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error('Error deleting EIN request:', error);
      throw error;
    }
  }
}

module.exports = EINRequest; 