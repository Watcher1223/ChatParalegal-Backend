const axios = require('axios');
const logger = require('../utils/logger');
const Company = require('../models/Company');
const EINRequest = require('../models/EINRequest');

class EINService {
  constructor() {
    this.partners = {
      firstbase: {
        apiKey: process.env.FIRSTBASE_API_KEY,
        baseUrl: 'https://api.firstbase.com/v1',
        webhookSecret: process.env.FIRSTBASE_WEBHOOK_SECRET
      },
      clerky: {
        apiKey: process.env.CLERKY_API_KEY,
        baseUrl: 'https://api.clerky.com/v1',
        webhookSecret: process.env.CLERKY_WEBHOOK_SECRET
      }
    };
  }

  async initiateEINApplication(companyId, partner = 'firstbase') {
    try {
      logger.info(`Initiating EIN application for company ${companyId} with partner ${partner}`);

      // Get company data
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Verify company is incorporated
      if (company.status !== 'incorporated') {
        throw new Error('Company must be incorporated before applying for EIN');
      }

      // Get incorporation documents
      const incorporationDocs = await this.getIncorporationDocuments(companyId);
      if (!incorporationDocs) {
        throw new Error('Incorporation documents not found');
      }

      // Prepare EIN application data
      const einData = this.prepareEINData(company, incorporationDocs, partner);

      // Create EIN request record
      const einRequest = await EINRequest.create({
        company_id: companyId,
        request_data: einData,
        status: 'pending'
      });

      // Send EIN application to partner
      const response = await this.sendEINApplication(partner, einData);

      // Update EIN request with response
      await EINRequest.update(einRequest.id, {
        response_data: response,
        submitted_at: new Date()
      });

      // Update company status
      await Company.updateStatus(companyId, 'pending_ein');

      logger.info(`EIN application initiated successfully for company ${companyId}`);
      
      return {
        success: true,
        ein_request_id: einRequest.id,
        message: 'EIN application submitted successfully'
      };

    } catch (error) {
      logger.error('Error initiating EIN application:', error);
      throw error;
    }
  }

  prepareEINData(company, incorporationDocs, partner) {
    const baseData = {
      company_name: company.company_name,
      entity_type: company.entity_type,
      state: company.state,
      company_details: company.company_details,
      articles_of_incorporation: incorporationDocs.articles_of_incorporation_url,
      formation_certificate: incorporationDocs.formation_certificate_url,
      business_purpose: company.company_details?.business_purpose || 'General business purposes',
      fiscal_year_end: company.company_details?.fiscal_year_end || '12/31'
    };

    // Partner-specific data formatting
    switch (partner) {
      case 'firstbase':
        return {
          ...baseData,
          ein_type: 'business',
          responsible_party: {
            name: company.company_details?.responsible_party_name,
            ssn: company.company_details?.responsible_party_ssn,
            address: company.company_details?.responsible_party_address
          }
        };
      
      case 'clerky':
        return {
          ...baseData,
          application_type: 'ss4',
          responsible_party_info: {
            name: company.company_details?.responsible_party_name,
            ssn: company.company_details?.responsible_party_ssn,
            address: company.company_details?.responsible_party_address
          }
        };
      
      default:
        return baseData;
    }
  }

  async sendEINApplication(partner, data) {
    try {
      const partnerConfig = this.partners[partner];
      if (!partnerConfig) {
        throw new Error(`Unsupported EIN partner: ${partner}`);
      }

      const response = await axios.post(
        `${partnerConfig.baseUrl}/ein-applications`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${partnerConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      logger.info(`EIN application sent to ${partner} successfully`);
      return response.data;

    } catch (error) {
      logger.error(`Error sending EIN application to ${partner}:`, error);
      throw new Error(`Failed to send EIN application: ${error.message}`);
    }
  }

  async handleEINWebhook(partner, webhookData, signature) {
    try {
      logger.info(`Processing EIN webhook from ${partner}`);

      const partnerConfig = this.partners[partner];
      if (!partnerConfig) {
        throw new Error(`Unsupported EIN partner: ${partner}`);
      }

      // Verify webhook signature
      if (!this.verifyWebhookSignature(partner, webhookData, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const { request_id, status, ein_number, documents } = webhookData;

      // Find EIN request
      const einRequest = await EINRequest.findByExternalId(request_id);
      if (!einRequest) {
        throw new Error('EIN request not found');
      }

      // Update EIN request status
      await EINRequest.update(einRequest.id, {
        status,
        response_data: webhookData,
        updated_at: new Date()
      });

      // If EIN is issued, update company and trigger bank setup
      if (status === 'issued' || status === 'completed') {
        await EINRequest.update(einRequest.id, {
          ein_number,
          ein_letter_url: documents?.ein_letter,
          issued_at: new Date()
        });

        // Update company status
        await Company.updateStatus(einRequest.company_id, 'ein_ready');

        // Trigger bank account setup
        await this.triggerBankSetup(einRequest.company_id);
      }

      logger.info(`EIN webhook processed successfully for ${partner}`);
      return { success: true };

    } catch (error) {
      logger.error('Error processing EIN webhook:', error);
      throw error;
    }
  }

  verifyWebhookSignature(partner, data, signature) {
    // Implement webhook signature verification based on partner
    // This is a simplified version - implement proper verification for production
    const partnerConfig = this.partners[partner];
    
    if (partner === 'firstbase') {
      // Implement Firstbase webhook verification
      return true; // Placeholder
    }
    
    return true; // Placeholder for other partners
  }

  async triggerBankSetup(companyId) {
    try {
      logger.info(`Triggering bank setup for company ${companyId}`);
      
      // Import Bank service and trigger setup
      const BankService = require('./BankService');
      const bankService = new BankService();
      
      await bankService.initiateBankSetup(companyId);
      
    } catch (error) {
      logger.error('Error triggering bank setup:', error);
      throw error;
    }
  }

  async getIncorporationDocuments(companyId) {
    try {
      // This would query the incorporation_requests table
      // For now, returning placeholder data
      return {
        articles_of_incorporation_url: 'https://example.com/articles.pdf',
        formation_certificate_url: 'https://example.com/certificate.pdf'
      };
    } catch (error) {
      logger.error('Error getting incorporation documents:', error);
      throw error;
    }
  }

  async getEINStatus(einRequestId) {
    try {
      const einRequest = await EINRequest.findById(einRequestId);
      if (!einRequest) {
        throw new Error('EIN request not found');
      }

      return {
        status: einRequest.status,
        ein_number: einRequest.ein_number,
        submitted_at: einRequest.submitted_at,
        issued_at: einRequest.issued_at
      };

    } catch (error) {
      logger.error('Error getting EIN status:', error);
      throw error;
    }
  }
}

module.exports = EINService; 