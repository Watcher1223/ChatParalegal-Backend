const axios = require('axios');
const logger = require('../utils/logger');
const Company = require('../models/Company');
const BankAccount = require('../models/BankAccount');
const EmailService = require('./EmailService');

class BankService {
  constructor() {
    this.providers = {
      mercury: {
        apiKey: process.env.MERCURY_API_KEY,
        baseUrl: 'https://api.mercury.com/v1',
        webhookSecret: process.env.MERCURY_WEBHOOK_SECRET
      }
    };
  }

  async initiateBankSetup(companyId, bankProvider = 'mercury') {
    try {
      logger.info(`Initiating bank setup for company ${companyId} with ${bankProvider}`);

      // Get company data
      const company = await Company.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Verify company has EIN
      if (company.status !== 'ein_ready') {
        throw new Error('Company must have EIN before setting up bank account');
      }

      // Get company documents and founder info
      const companyDocs = await this.getCompanyDocuments(companyId);
      const founders = await this.getFounders(companyId);

      // Prepare bank application data
      const bankData = this.prepareBankData(company, companyDocs, founders, bankProvider);

      // Create bank account record
      const bankAccount = await BankAccount.create({
        company_id: companyId,
        bank_provider: bankProvider,
        kyc_data: bankData.kyc_data,
        status: 'pending'
      });

      // Send bank application
      const response = await this.sendBankApplication(bankProvider, bankData);

      // Update bank account with response
      await BankAccount.update(bankAccount.id, {
        external_account_id: response.account_id,
        account_details: response,
        submitted_at: new Date()
      });

      // Update company status
      await Company.updateStatus(companyId, 'pending_bank_approval');

      logger.info(`Bank setup initiated successfully for company ${companyId}`);
      
      return {
        success: true,
        bank_account_id: bankAccount.id,
        message: 'Bank application submitted successfully'
      };

    } catch (error) {
      logger.error('Error initiating bank setup:', error);
      throw error;
    }
  }

  prepareBankData(company, companyDocs, founders, provider) {
    const baseData = {
      company_name: company.company_name,
      entity_type: company.entity_type,
      state: company.state,
      ein_number: company.ein_number,
      articles_of_incorporation: companyDocs.articles_of_incorporation_url,
      formation_certificate: companyDocs.formation_certificate_url,
      ein_letter: companyDocs.ein_letter_url
    };

    // Provider-specific data formatting
    switch (provider) {
      case 'mercury':
        return {
          ...baseData,
          account_type: 'checking',
          founders: founders.map(founder => ({
            legal_name: founder.legal_name,
            date_of_birth: founder.date_of_birth,
            address: founder.address,
            id_type: founder.id_type,
            id_number: founder.id_number,
            id_front_image: founder.id_front_image_url,
            id_back_image: founder.id_back_image_url,
            selfie_image: founder.selfie_image_url
          })),
          kyc_data: {
            business_type: company.entity_type,
            industry: company.company_details?.industry || 'Technology',
            expected_monthly_transactions: company.company_details?.expected_monthly_transactions || 10000,
            expected_monthly_volume: company.company_details?.expected_monthly_volume || 50000
          }
        };
      
      default:
        return baseData;
    }
  }

  async sendBankApplication(provider, data) {
    try {
      const providerConfig = this.providers[provider];
      if (!providerConfig) {
        throw new Error(`Unsupported bank provider: ${provider}`);
      }

      const response = await axios.post(
        `${providerConfig.baseUrl}/accounts`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${providerConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      logger.info(`Bank application sent to ${provider} successfully`);
      return response.data;

    } catch (error) {
      logger.error(`Error sending bank application to ${provider}:`, error);
      throw new Error(`Failed to send bank application: ${error.message}`);
    }
  }

  async handleBankWebhook(provider, webhookData, signature) {
    try {
      logger.info(`Processing bank webhook from ${provider}`);

      const providerConfig = this.providers[provider];
      if (!providerConfig) {
        throw new Error(`Unsupported bank provider: ${provider}`);
      }

      // Verify webhook signature
      if (!this.verifyWebhookSignature(provider, webhookData, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const { account_id, status, account_details } = webhookData;

      // Find bank account
      const bankAccount = await BankAccount.findByExternalId(account_id);
      if (!bankAccount) {
        throw new Error('Bank account not found');
      }

      // Update bank account status
      await BankAccount.update(bankAccount.id, {
        status,
        account_details: account_details,
        updated_at: new Date()
      });

      // If approved, update company and send credentials
      if (status === 'approved' || status === 'active') {
        await BankAccount.update(bankAccount.id, {
          account_number: account_details.masked_account_number,
          routing_number: account_details.routing_number,
          approved_at: new Date()
        });

        // Update company status
        await Company.updateStatus(bankAccount.company_id, 'bank_ready');

        // Send account credentials to founder
        await this.sendAccountCredentials(bankAccount.company_id, account_details);
      }

      logger.info(`Bank webhook processed successfully for ${provider}`);
      return { success: true };

    } catch (error) {
      logger.error('Error processing bank webhook:', error);
      throw error;
    }
  }

  verifyWebhookSignature(provider, data, signature) {
    // Implement webhook signature verification based on provider
    const providerConfig = this.providers[provider];
    
    if (provider === 'mercury') {
      // Implement Mercury webhook verification
      return true; // Placeholder
    }
    
    return true; // Placeholder for other providers
  }

  async sendAccountCredentials(companyId, accountDetails) {
    try {
      const company = await Company.findById(companyId);
      const founders = await this.getFounders(companyId);

      if (founders && founders.length > 0) {
        const founder = founders[0]; // Primary founder
        
        const emailService = new EmailService();
        await emailService.sendBankAccountCredentials({
          to: founder.email,
          companyName: company.company_name,
          accountNumber: accountDetails.masked_account_number,
          routingNumber: accountDetails.routing_number,
          bankName: 'Mercury',
          loginUrl: 'https://mercury.com/login'
        });
      }

      logger.info(`Account credentials sent for company ${companyId}`);

    } catch (error) {
      logger.error('Error sending account credentials:', error);
      throw error;
    }
  }

  async getCompanyDocuments(companyId) {
    // This would query the incorporation_requests and ein_requests tables
    // For now, returning placeholder data
    return {
      articles_of_incorporation_url: 'https://example.com/articles.pdf',
      formation_certificate_url: 'https://example.com/certificate.pdf',
      ein_letter_url: 'https://example.com/ein_letter.pdf'
    };
  }

  async getFounders(companyId) {
    // This would query the founders table
    // For now, returning placeholder data
    return [{
      email: 'founder@example.com',
      legal_name: 'John Doe',
      date_of_birth: '1990-01-01',
      address: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
      id_type: 'passport',
      id_number: '123456789',
      id_front_image_url: 'https://example.com/id_front.jpg',
      id_back_image_url: 'https://example.com/id_back.jpg',
      selfie_image_url: 'https://example.com/selfie.jpg'
    }];
  }
}

module.exports = BankService; 