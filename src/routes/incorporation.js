const express = require('express');
const MockIncorporationService = require('../services/MockIncorporationService');
const logger = require('../utils/logger');

const router = express.Router();
const mockIncorporationService = new MockIncorporationService();

// Initiate incorporation process
router.post('/initiate/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const { formation_provider = 'firstbase' } = req.body;

    logger.info(`[MOCK] Initiating incorporation for company ${companyId}`);

    const result = await mockIncorporationService.initiateIncorporation(companyId, formation_provider);

    res.json({
      success: true,
      message: 'Incorporation process initiated successfully (MOCK)',
      data: result
    });

  } catch (error) {
    next(error);
  }
});

// Get incorporation status
router.get('/status/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const status = await mockIncorporationService.getIncorporationStatus(companyId);

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    next(error);
  }
});

// Get incorporation documents
router.get('/documents/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const documents = await mockIncorporationService.getIncorporationDocuments(companyId);

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 