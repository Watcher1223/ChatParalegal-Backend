const db = require('../database/connection');
const logger = require('../utils/logger');

class BankAccount {
  static async create(accountData) {
    try {
      const [account] = await db('bank_accounts')
        .insert(accountData)
        .returning('*');
      
      logger.info(`Bank account created: ${account.id}`);
      return account;
    } catch (error) {
      logger.error('Error creating bank account:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const account = await db('bank_accounts')
        .where({ id })
        .first();
      
      return account;
    } catch (error) {
      logger.error('Error finding bank account by ID:', error);
      throw error;
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const accounts = await db('bank_accounts')
        .where({ company_id: companyId })
        .orderBy('created_at', 'desc');
      
      return accounts;
    } catch (error) {
      logger.error('Error finding bank accounts by company ID:', error);
      throw error;
    }
  }

  static async findByExternalId(externalId) {
    try {
      const account = await db('bank_accounts')
        .where({ external_account_id: externalId })
        .first();
      
      return account;
    } catch (error) {
      logger.error('Error finding bank account by external ID:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const [account] = await db('bank_accounts')
        .where({ id })
        .update({
          ...updateData,
          updated_at: db.fn.now()
        })
        .returning('*');
      
      logger.info(`Bank account ${id} updated successfully`);
      return account;
    } catch (error) {
      logger.error('Error updating bank account:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db('bank_accounts')
        .where({ id })
        .del();
      
      logger.info(`Bank account ${id} deleted successfully`);
      return true;
    } catch (error) {
      logger.error('Error deleting bank account:', error);
      throw error;
    }
  }
}

module.exports = BankAccount; 