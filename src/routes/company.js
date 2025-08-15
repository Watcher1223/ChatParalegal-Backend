const express = require('express');
const { body, validationResult } = require('express-validator');
const MockDataService = require('../services/MockDataService');
const logger = require('../utils/logger');

const router = express.Router();
const mockData = new MockDataService();

// Validation middleware
const validateCompanyRegistration = [
  body('company_name').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('entity_type').isIn(['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship']).withMessage('Invalid entity type'),
  body('state').trim().isLength({ min: 2, max: 2 }).withMessage('State must be 2 characters'),
  body('company_details').optional().isObject().withMessage('Company details must be an object')
];

const validateFounderInfo = [
  body('legal_name').trim().isLength({ min: 2, max: 100 }).withMessage('Legal name must be between 2 and 100 characters'),
  body('date_of_birth').isISO8601().withMessage('Date of birth must be a valid date'),
  body('address').isObject().withMessage('Address must be an object'),
  body('address.street').trim().isLength({ min: 5, max: 200 }).withMessage('Street address must be between 5 and 200 characters'),
  body('address.city').trim().isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),
  body('address.state').trim().isLength({ min: 2, max: 2 }).withMessage('State must be 2 characters'),
  body('address.zip').trim().isLength({ min: 5, max: 10 }).withMessage('ZIP code must be between 5 and 10 characters'),
  body('id_type').isIn(['passport', 'driver_license', 'state_id', 'military_id']).withMessage('Invalid ID type'),
  body('id_number').trim().isLength({ min: 5, max: 50 }).withMessage('ID number must be between 5 and 50 characters')
];

// Register new company with founder information
router.post('/register', validateCompanyRegistration, validateFounderInfo, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { company_name, entity_type, state, company_details, founder } = req.body;

    // Create company
    const company = mockData.createCompany({
      company_name,
      entity_type,
      state,
      company_details
    });

    // Create founder
    const founderRecord = mockData.createFounder({
      company_id: company.id,
      ...founder
    });

    logger.info(`[MOCK] Company registration completed: ${company.company_name}`);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully (MOCK)',
      data: {
        company_id: company.id,
        company_name: company.company_name,
        status: company.status,
        founder_id: founderRecord.id
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get company details
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const company = mockData.getCompanyById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: 'Company not found' }
      });
    }

    const founders = mockData.getFoundersByCompanyId(id);

    res.json({
      success: true,
      data: {
        company,
        founders
      }
    });

  } catch (error) {
    next(error);
  }
});

// Update company information
router.put('/:id', validateCompanyRegistration, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const company = mockData.getCompanyById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: 'Company not found' }
      });
    }

    // Only allow updates if company is still pending
    if (company.status !== 'pending_incorporation') {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot update company after incorporation process has begun' }
      });
    }

    // Update company data
    Object.assign(company, updateData);
    company.updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: 'Company updated successfully (MOCK)',
      data: company
    });

  } catch (error) {
    next(error);
  }
});

// Get all companies
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let companies;
    if (status) {
      companies = mockData.getCompaniesByStatus(status);
    } else {
      companies = mockData.getAllCompanies();
    }

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCompanies = companies.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        companies: paginatedCompanies,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(companies.length / limit),
          total_companies: companies.length,
          companies_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// Delete company (only if pending)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const company = mockData.getCompanyById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: { message: 'Company not found' }
      });
    }

    if (company.status !== 'pending_incorporation') {
      return res.status(400).json({
        success: false,
        error: { message: 'Cannot delete company after incorporation process has begun' }
      });
    }

    // Remove company from mock data
    const companyIndex = mockData.mockData.companies.findIndex(c => c.id === id);
    if (companyIndex > -1) {
      mockData.mockData.companies.splice(companyIndex, 1);
    }

    res.json({
      success: true,
      message: 'Company deleted successfully (MOCK)'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 