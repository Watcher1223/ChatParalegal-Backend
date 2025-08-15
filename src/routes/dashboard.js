const express = require('express');
const MockDataService = require('../services/MockDataService');
const logger = require('../utils/logger');

const router = express.Router();
const mockData = new MockDataService();

// Helper function to determine step status
const getStepStatus = (companyStatus, completedStatuses) => {
  if (completedStatuses.includes(companyStatus)) {
    return 'completed';
  } else if (companyStatus === 'pending_incorporation') {
    return 'pending';
  } else if (companyStatus === 'incorporation_in_progress') {
    return 'in_progress';
  } else if (companyStatus === 'incorporated') {
    return 'ready';
  } else if (companyStatus === 'ein_ready') {
    return 'ready';
  } else {
    return 'pending';
  }
};

// Get dashboard overview
router.get('/overview', async (req, res, next) => {
  try {
    const stats = mockData.getDashboardStats();
    
    res.json({
      success: true,
      data: {
        statistics: stats,
        recent_activity: [
          {
            type: 'company_registered',
            company_name: 'Local Food Market',
            timestamp: new Date().toISOString(),
            status: 'pending_incorporation'
          },
          {
            type: 'incorporation_completed',
            company_name: 'Creative Design Studio',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'incorporated'
          },
          {
            type: 'ein_issued',
            company_name: 'GreenEnergy Solutions',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'ein_ready'
          },
          {
            type: 'bank_account_approved',
            company_name: 'TechStartup Inc',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'bank_ready'
          }
        ]
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get process flow for a specific company
router.get('/process/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;
    
    const company = mockData.getCompanyById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: 'Company not found' }
      });
    }

    const founders = mockData.getFoundersByCompanyId(companyId);
    const incorporation = mockData.getIncorporationByCompanyId(companyId);
    const ein = mockData.getEINByCompanyId(companyId);
    const bank = mockData.getBankAccountByCompanyId(companyId);

    const processFlow = {
      company: {
        id: company.id,
        name: company.company_name,
        entity_type: company.entity_type,
        state: company.state,
        status: company.status
      },
      steps: [
        {
          step: 1,
          name: 'Company Registration',
          status: 'completed',
          completed_at: company.created_at,
          details: {
            founders_count: founders.length,
            business_purpose: company.company_details?.business_purpose
          }
        },
        {
          step: 2,
          name: 'Incorporation',
          status: getStepStatus(company.status, ['incorporation_in_progress', 'incorporated', 'ein_ready', 'bank_ready']),
          completed_at: incorporation?.completed_at,
          details: {
            formation_provider: incorporation?.formation_provider,
            external_id: incorporation?.external_request_id
          }
        },
        {
          step: 3,
          name: 'EIN Application',
          status: getStepStatus(company.status, ['ein_ready', 'bank_ready']),
          completed_at: ein?.issued_at,
          details: {
            ein_number: ein?.ein_number,
            ein_letter: ein?.ein_letter_url
          }
        },
        {
          step: 4,
          name: 'Bank Account Setup',
          status: getStepStatus(company.status, ['bank_ready']),
          completed_at: bank?.approved_at,
          details: {
            bank_provider: bank?.bank_provider,
            account_number: bank?.account_number,
            routing_number: bank?.routing_number
          }
        }
      ]
    };

    res.json({
      success: true,
      data: processFlow
    });

  } catch (error) {
    next(error);
  }
});

// Simulate process progression
router.post('/simulate-progression', async (req, res, next) => {
  try {
    mockData.simulateProcessProgression();
    
    res.json({
      success: true,
      message: 'Process progression simulated successfully',
      data: {
        updated_stats: mockData.getDashboardStats()
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 