const express = require('express');
const MockBankService = require('../services/MockBankService');
const logger = require('../utils/logger');

const router = express.Router();
const mockBankService = new MockBankService();

// Get bank account status
router.get('/status/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const status = await mockBankService.getBankAccountStatus(companyId);

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    next(error);
  }
});

// Get bank account details (once approved)
router.get('/account/:companyId', async (req, res, next) => {
  try {
    const { companyId } = req.params;

    const accountDetails = await mockBankService.getBankAccountDetails(companyId);

    res.json({
      success: true,
      data: accountDetails
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 