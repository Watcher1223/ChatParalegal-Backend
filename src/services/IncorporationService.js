const axios = require('axios');
const logger = require('../utils/logger');
const Company = require('../models/Company');
const IncorporationRequest = require('../models/IncorporationRequest');

class IncorporationService {
  constructor() {
    this.providers = {
      firstbase: {
        apiKey: process.env.FIRSTBASE_API_KEY,
        baseUrl: 'https://api.firstbase.com/v1',
        webhookSecret: process.env.FIRSTBASE_WEBHOOK_SECRET
      },
      clerky: {
        apiKey: process.env.CLERKY_API_KEY,
        baseUrl: 'https://api.clerky.com/v1',
        webhookSecret: process.env.CLERKY_WEBHOOK_SECRET
      },
      zenbusiness: {
        apiKey: process.env.ZENBUSINESS_API_KEY,
        baseUrl: 'https://api.zenbusiness.com/v1',
        webhookSecret: process.env.ZENBUSINESS_WEBHOOK_SECRET
      }
    };
  }

  async initiateIncorporation(companyId, formationProvider = 'firstbase') {
    try {
      logger.info(`Initiating incorporation for company ${companyId} with ${formationProvider}`);

      // Get company data
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Get founder data
      const founders = await this.getFounders(companyId);
      if (!founders || founders.length === 0) {
        throw new Error('No founders found for company');
      }

      // Prepare incorporation data
      const incorporationData = this.prepareIncorporationData(company, founders, formationProvider);

      // Create incorporation request record
      const incorporationRequest = await IncorporationRequest.create({
        company_id: companyId,
        formation_provider: formationProvider,
        request_data: incorporationData,
        status: 'pending'
      });

      // Send request to formation provider
      const response = await this.sendIncorporationRequest(formationProvider, incorporationData);

      // Update incorporation request with response
      await IncorporationRequest.update(incorporationRequest.id, {
        external_request_id: response.request_id,
        response_data: response,
        submitted_at: new Date()
      });

      // Update company status
      await Company.updateStatus(companyId, 'incorporation_in_progress');

      logger.info(`Incorporation initiated successfully for company ${companyId}`);
      
      return {
        success: true,
        incorporation_request_id: incorporationRequest.id,
        external_request_id: response.request_id,
        message: 'Incorporation request submitted successfully'
      };

    } catch (error) {
      logger.error('Error initiating incorporation:', error);
      throw error;
    }
  }

  prepareIncorporationData(company, founders, provider) {
    const baseData = {
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
    };

    // Provider-specific data formatting
    switch (provider) {
      case 'firstbase':
        return {
          ...baseData,
          formation_type: 'llc', // or corporation
          registered_agent: {
            use_partner: true
          }
        };
      
      case 'clerky':
        return {
          ...baseData,
          formation_package: 'standard',
          registered_agent_service: true
        };
      
      case 'zenbusiness':
        return {
          ...baseData,
          formation_package: 'starter',
          registered_agent: true
        };
      
      default:
        return baseData;
    }
  }

  async sendIncorporationRequest(provider, data) {
    try {
      const providerConfig = this.providers[provider];
      if (!providerConfig) {
        throw new Error(`Unsupported formation provider: ${provider}`);
      }

      const response = await axios.post(
        `${providerConfig.baseUrl}/formations`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${providerConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      logger.info(`Incorporation request sent to ${provider} successfully`);
      return response.data;

    } catch (error) {
      logger.error(`Error sending incorporation request to ${provider}:`, error);
      throw new Error(`Failed to send incorporation request: ${error.message}`);
    }
  }

  async handleWebhook(provider, webhookData, signature) {
    try {
      logger.info(`Processing webhook from ${provider}`);

      const providerConfig = this.providers[provider];
      if (!providerConfig) {
        throw new Error(`Unsupported formation provider: ${provider}`);
      }

      // Verify webhook signature
      if (!this.verifyWebhookSignature(provider, webhookData, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const { request_id, status, documents } = webhookData;

      // Find incorporation request
      const incorporationRequest = await IncorporationRequest.findByExternalId(request_id);
      if (!incorporationRequest) {
        throw new Error('Incorporation request not found');
      }

      // Update incorporation request status
      await IncorporationRequest.update(incorporationRequest.id, {
        status,
        response_data: webhookData,
        updated_at: new Date()
      });

      // If incorporation is complete, trigger EIN application
      if (status === 'incorporated' || status === 'completed') {
        await IncorporationRequest.update(incorporationRequest.id, {
          completed_at: new Date(),
          articles_of_incorporation_url: documents?.articles_of_incorporation,
          formation_certificate_url: documents?.formation_certificate
        });

        // Update company status
        await Company.updateStatus(incorporationRequest.company_id, 'incorporated');

        // Trigger EIN application
        await this.triggerEINApplication(incorporationRequest.company_id);
      }

      logger.info(`Webhook processed successfully for ${provider}`);
      return { success: true };

    } catch (error) {
      logger.error('Error processing webhook:', error);
      throw error;
    }
  }

  verifyWebhookSignature(provider, data, signature) {
    // Implement webhook signature verification based on provider
    // This is a simplified version - implement proper verification for production
    const providerConfig = this.providers[provider];
    
    if (provider === 'firstbase') {
      // Implement Firstbase webhook verification
      return true; // Placeholder
    }
    
    return true; // Placeholder for other providers
  }

  async triggerEINApplication(companyId) {
    try {
      logger.info(`Triggering EIN application for company ${companyId}`);
      
      // Import EIN service and trigger application
      const EINService = require('./EINService');
      const einService = new EINService();
      
      await einService.initiateEINApplication(companyId);
      
    } catch (error) {
      logger.error('Error triggering EIN application:', error);
      throw error;
    }
  }

  async getFounders(companyId) {
    // This would be implemented in a Founder model
    // For now, returning placeholder
    return [];
  }
}

module.exports = IncorporationService; 