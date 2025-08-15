const MockDataService = require('./MockDataService');
const logger = require('../utils/logger');

class MockIncorporationService {
  constructor() {
    this.mockData = new MockDataService();
  }

  async initiateIncorporation(companyId, formationProvider = 'firstbase') {
    try {
      logger.info(`[MOCK] Initiating incorporation for company ${companyId} with ${formationProvider}`);

      // Get company data
      const company = this.mockData.getCompanyById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Get founder data
      const founders = this.mockData.getFoundersByCompanyId(companyId);
      if (!founders || founders.length === 0) {
        throw new Error('No founders found for company');
      }

      // Create incorporation request record
      const incorporationRequest = this.mockData.createIncorporationRequest({
        company_id: companyId,
        formation_provider: formationProvider,
        request_data: {
          company_name: company.company_name,
          entity_type: company.entity_type,
          state: company.state,
          company_details: company.company_details,
          founders: founders.map(founder => ({
            legal_name: founder.legal_name,
            date_of_birth: founder.date_of_birth,
            address: founder.address,
            id_type: founder.id_type,
            id_number: founder.id_number
          }))
        },
        status: 'pending'
      });

      // Simulate API response
      const mockResponse = {
        request_id: `FB${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'submitted',
        estimated_completion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Update incorporation request with response
      incorporationRequest.external_request_id = mockResponse.request_id;
      incorporationRequest.response_data = mockResponse;
      incorporationRequest.submitted_at = new Date();

      // Update company status
      this.mockData.updateCompanyStatus(companyId, 'incorporation_in_progress');

      logger.info(`[MOCK] Incorporation initiated successfully for company ${companyId}`);
      
      return {
        success: true,
        incorporation_request_id: incorporationRequest.id,
        external_request_id: mockResponse.request_id,
        message: 'Incorporation request submitted successfully (MOCK)',
        estimated_completion: mockResponse.estimated_completion
      };

    } catch (error) {
      logger.error('[MOCK] Error initiating incorporation:', error);
      throw error;
    }
  }

  async getIncorporationStatus(companyId) {
    try {
      const incorporation = this.mockData.getIncorporationByCompanyId(companyId);
      if (!incorporation) {
        return {
          status: 'not_started',
          message: 'No incorporation request found'
        };
      }

      // Simulate status progression
      if (incorporation.status === 'pending' && Math.random() < 0.3) {
        incorporation.status = 'in_progress';
        incorporation.updated_at = new Date().toISOString();
      } else if (incorporation.status === 'in_progress' && Math.random() < 0.4) {
        incorporation.status = 'completed';
        incorporation.completed_at = new Date().toISOString();
        
        // Update company status
        this.mockData.updateCompanyStatus(companyId, 'incorporated');
        
        // Simulate EIN application trigger
        setTimeout(() => {
          this.triggerEINApplication(companyId);
        }, 2000);
      }

      return {
        status: incorporation.status,
        formation_provider: incorporation.formation_provider,
        submitted_at: incorporation.submitted_at,
        completed_at: incorporation.completed_at,
        estimated_completion: incorporation.response_data?.estimated_completion,
        documents: incorporation.status === 'completed' ? {
          articles_of_incorporation: incorporation.articles_of_incorporation_url,
          formation_certificate: incorporation.formation_certificate_url
        } : null
      };

    } catch (error) {
      logger.error('[MOCK] Error getting incorporation status:', error);
      throw error;
    }
  }

  async triggerEINApplication(companyId) {
    try {
      logger.info(`[MOCK] Triggering EIN application for company ${companyId}`);
      
      // Simulate EIN application process
      setTimeout(() => {
        this.mockData.updateCompanyStatus(companyId, 'ein_ready');
        logger.info(`[MOCK] EIN application completed for company ${companyId}`);
        
        // Simulate bank setup trigger
        setTimeout(() => {
          this.triggerBankSetup(companyId);
        }, 3000);
      }, 5000);

    } catch (error) {
      logger.error('[MOCK] Error triggering EIN application:', error);
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

  async getIncorporationDocuments(companyId) {
    try {
      const incorporation = this.mockData.getIncorporationByCompanyId(companyId);
      if (!incorporation || incorporation.status !== 'completed') {
        return {
          status: 'not_ready',
          message: 'Documents not yet available'
        };
      }

      return {
        status: 'ready',
        documents: {
          articles_of_incorporation: incorporation.articles_of_incorporation_url,
          formation_certificate: incorporation.formation_certificate_url,
          operating_agreement: 'https://example.com/operating_agreement.pdf',
          bylaws: 'https://example.com/bylaws.pdf'
        }
      };

    } catch (error) {
      logger.error('[MOCK] Error getting incorporation documents:', error);
      throw error;
    }
  }
}

module.exports = MockIncorporationService; 