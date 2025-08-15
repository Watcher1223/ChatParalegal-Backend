const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('first_name').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('last_name').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// User registration
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, first_name, last_name, company_id } = req.body;

    // Check if user already exists
    // This would query the users table
    // For now, assuming user doesn't exist

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    // This would insert into the users table
    // For now, returning placeholder data
    const user = {
      id: 'user-123',
      email,
      first_name,
      last_name,
      company_id,
      role: 'founder',
      created_at: new Date().toISOString()
    };

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
});

// User login
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    // This would query the users table
    // For now, using placeholder data
    const user = {
      id: 'user-123',
      email,
      password_hash: '$2a$12$placeholder_hash',
      first_name: 'John',
      last_name: 'Doe',
      role: 'founder',
      company_id: 'company-123'
    };

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    logger.info(`User logged in successfully: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          company_id: user.company_id
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get current user profile
router.get('/profile', async (req, res, next) => {
  try {
    // This would extract user from JWT token
    // For now, returning placeholder data
    const user = {
      id: 'user-123',
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'founder',
      company_id: 'company-123',
      created_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router; 