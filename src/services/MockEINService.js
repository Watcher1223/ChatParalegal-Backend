const MockDataService = require('./MockDataService');
const logger = require('../utils/logger');

class MockEINService {
  constructor() {
    this.mockData = new MockDataService();
  }

  async getEINStatus(companyId) {
    try {
      const einRequest = this.mockData.getEINByCompanyId(companyId);
      const company = this.mockData.getCompanyById(companyId);

      if (!company) {
        throw new Error('Company not found');
      }

      if (!einRequest) {
        // Check if company is ready for EIN
        if (company.status === 'incorporated') {
          return {
            status: 'ready_to_apply',
            message: 'Company is incorporated and ready for EIN application',
            next_step: 'EIN application will be automatically initiated'
          };
        } else if (company.status === 'pending_incorporation' || company.status === 'incorporation_in_progress') {
          return {
            status: 'waiting_for_incorporation',
            message: 'Company must be incorporated before applying for EIN',
            next_step: 'Complete incorporation process first'
          };
        }
      }

      // Simulate EIN status progression
      if (einRequest.status === 'pending' && Math.random() < 0.4) {
        einRequest.status = 'processing';
        einRequest.updated_at = new Date().toISOString();
      } else if (einRequest.status === 'processing' && Math.random() < 0.5) {
        einRequest.status = 'issued';
        einRequest.ein_number = this.generateMockEIN();
        einRequest.issued_at = new Date().toISOString();
        einRequest.ein_letter_url = `https://example.com/ein_letter_${companyId}.pdf`;
        
        // Update company status
        this.mockData.updateCompanyStatus(companyId, 'ein_ready');
        
        // Simulate bank setup trigger
        setTimeout(() => {
          this.triggerBankSetup(companyId);
        }, 3000);
      }

      return {
        status: einRequest?.status || 'not_started',
        ein_number: einRequest?.ein_number,
        submitted_at: einRequest?.submitted_at,
        issued_at: einRequest?.issued_at,
        estimated_completion: einRequest?.response_data?.estimated_completion,
        ein_letter_url: einRequest?.ein_letter_url,
        message: this.getEINStatusMessage(einRequest?.status)
      };

    } catch (error) {
      logger.error('[MOCK] Error getting EIN status:', error);
      throw error;
    }
  }

  async getEINNumber(companyId) {
    try {
      const einRequest = this.mockData.getEINByCompanyId(companyId);
      
      if (!einRequest || einRequest.status !== 'issued') {
        return {
          status: 'not_issued',
          message: 'EIN has not been issued yet'
        };
      }

      return {
        status: 'issued',
        ein_number: einRequest.ein_number,
        issued_at: einRequest.issued_at,
        ein_letter_url: einRequest.ein_letter_url
      };

    } catch (error) {
      logger.error('[MOCK] Error getting EIN number:', error);
      throw error;
    }
  }

  async triggerBankSetup(companyId) {
    try {
      logger.info(`[MOCK] Triggering bank setup for company ${companyId}`);
      
      // Simulate bank account setup
      setTimeout(() => {
        this.mockData.updateCompanyStatus(companyId, 'bank_ready');
        logger.info(`[MOCK] Bank setup completed for company ${companyId}`);
      }, 8000);

    } catch (error) {
      logger.error('[MOCK] Error triggering bank setup:', error);
    }
  }

  generateMockEIN() {
    // Generate a realistic EIN format: XX-XXXXXXX
    const firstPart = Math.floor(Math.random() * 99) + 1;
    const secondPart = Math.floor(Math.random() * 9999999) + 1000000;
    return `${firstPart.toString().padStart(2, '0')}-${secondPart}`;
  }

  getEINStatusMessage(status) {
    const messages = {
      'not_started': 'EIN application has not been started yet',
      'ready_to_apply': 'Ready to apply for EIN',
      'waiting_for_incorporation': 'Waiting for incorporation to complete',
      'pending': 'EIN application is pending with the IRS',
      'processing': 'EIN application is being processed',
      'issued': 'EIN has been issued successfully',
      'error': 'There was an error with the EIN application'
    };
    
    return messages[status] || 'Unknown status';
  }
}

module.exports = MockEINService; 