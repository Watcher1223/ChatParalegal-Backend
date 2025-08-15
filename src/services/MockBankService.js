const MockDataService = require('./MockDataService');
const logger = require('../utils/logger');

class MockBankService {
  constructor() {
    this.mockData = new MockDataService();
  }

  async getBankAccountStatus(companyId) {
    try {
      const bankAccount = this.mockData.getBankAccountByCompanyId(companyId);
      const company = this.mockData.getCompanyById(companyId);

      if (!company) {
        throw new Error('Company not found');
      }

      if (!bankAccount) {
        // Check if company is ready for bank setup
        if (company.status === 'ein_ready') {
          return {
            status: 'ready_to_apply',
            message: 'Company has EIN and is ready for bank account setup',
            next_step: 'Bank account application will be automatically initiated',
            estimated_completion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          };
        } else if (company.status === 'pending_incorporation' || company.status === 'incorporation_in_progress' || company.status === 'incorporated') {
          return {
            status: 'waiting_for_ein',
            message: 'Company must have EIN before setting up bank account',
            next_step: 'Complete EIN application first',
            estimated_completion: null
          };
        }
      }

      // Simulate bank account status progression
      if (bankAccount.status === 'pending' && Math.random() < 0.3) {
        bankAccount.status = 'under_review';
        bankAccount.updated_at = new Date().toISOString();
      } else if (bankAccount.status === 'under_review' && Math.random() < 0.4) {
        bankAccount.status = 'approved';
        bankAccount.approved_at = new Date().toISOString();
        bankAccount.account_number = this.generateMockAccountNumber();
        bankAccount.routing_number = '021000021'; // Chase Bank routing number
        
        // Update company status
        this.mockData.updateCompanyStatus(companyId, 'bank_ready');
      }

      return {
        status: bankAccount?.status || 'not_started',
        bank_provider: bankAccount?.bank_provider || 'mercury',
        submitted_at: bankAccount?.submitted_at,
        approved_at: bankAccount?.approved_at,
        estimated_completion: bankAccount?.response_data?.estimated_completion,
        message: this.getBankStatusMessage(bankAccount?.status)
      };

    } catch (error) {
      logger.error('[MOCK] Error getting bank account status:', error);
      throw error;
    }
  }

  async getBankAccountDetails(companyId) {
    try {
      const bankAccount = this.mockData.getBankAccountByCompanyId(companyId);
      
      if (!bankAccount || bankAccount.status !== 'approved') {
        return {
          status: 'not_ready',
          message: 'Bank account details not yet available'
        };
      }

      return {
        status: 'ready',
        account_number: bankAccount.account_number,
        routing_number: bankAccount.routing_number,
        account_type: bankAccount.account_type,
        bank_name: 'Mercury',
        approved_at: bankAccount.approved_at,
        account_details: bankAccount.account_details
      };

    } catch (error) {
      logger.error('[MOCK] Error getting bank account details:', error);
      throw error;
    }
  }

  generateMockAccountNumber() {
    // Generate a masked account number: ****XXXX
    const lastFour = Math.floor(Math.random() * 9999) + 1000;
    return `****${lastFour}`;
  }

  getBankStatusMessage(status) {
    const messages = {
      'not_started': 'Bank account setup has not been started yet',
      'ready_to_apply': 'Ready to apply for bank account',
      'waiting_for_ein': 'Waiting for EIN to be issued',
      'pending': 'Bank account application is pending',
      'under_review': 'Bank account application is under review',
      'approved': 'Bank account has been approved',
      'rejected': 'Bank account application was rejected',
      'error': 'There was an error with the bank account application'
    };
    
    return messages[status] || 'Unknown status';
  }
}

module.exports = MockBankService; 