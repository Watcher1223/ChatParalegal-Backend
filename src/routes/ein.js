const express = require('express');
const MockEINService = require('../services/MockEINService');
const logger = require('../utils/logger');

const router = express.Router();
const mockEINService = new MockEINService();

// Get EIN status
router.get('/status/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const status = await mockEINService.getEINStatus(companyId);

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    next(error);
  }
});

// Get EIN number (once issued)
router.get('/number/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const einData = await mockEINService.getEINNumber(companyId);

    res.json({
      success: true,
      data: einData
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 