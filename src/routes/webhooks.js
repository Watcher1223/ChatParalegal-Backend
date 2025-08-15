const express = require('express');
const IncorporationService = require('../services/IncorporationService');
const EINService = require('../services/EINService');
const BankService = require('../services/BankService');
const logger = require('../utils/logger');

const router = express.Router();

// Webhook for incorporation status updates
router.post('/incorporation/:provider', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const signature = req.headers['x-signature'] || req.headers['authorization'];
    
    logger.info(`Received incorporation webhook from ${provider}`);

    const incorporationService = new IncorporationService();
    await incorporationService.handleWebhook(provider, req.body, signature);

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    logger.error('Error processing incorporation webhook:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Webhook for EIN status updates
router.post('/ein/:partner', async (req, res, next) => {
  try {
    const { partner } = req.params;
    const signature = req.headers['x-signature'] || req.headers['authorization'];
    
    logger.info(`Received EIN webhook from ${partner}`);

    const einService = new EINService();
    await einService.handleEINWebhook(partner, req.body, signature);

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    logger.error('Error processing EIN webhook:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Webhook for bank account status updates
router.post('/bank/:provider', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const signature = req.headers['x-signature'] || req.headers['authorization'];
    
    logger.info(`Received bank webhook from ${provider}`);

    const bankService = new BankService();
    await bankService.handleBankWebhook(provider, req.body, signature);

    res.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    logger.error('Error processing bank webhook:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generic webhook endpoint for testing
router.post('/test', (req, res) => {
  logger.info('Test webhook received:', req.body);
  res.json({ 
    success: true, 
    message: 'Test webhook received',
    timestamp: new Date().toISOString(),
    data: req.body
  });
});

module.exports = router; 