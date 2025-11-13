import express from 'express';
import { body } from 'express-validator';
import { register, login, refreshToken, logout, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

import { validateRequest } from '../middleware/validator.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const refreshTokenValidation = [
  body('refreshToken').notEmpty(),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail(),
];

const resetPasswordValidation = [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
];

// Routes
router.post('/register',  registerValidation, validateRequest, register);
router.post('/login',  loginValidation, validateRequest, login);
router.post('/refresh', refreshTokenValidation, validateRequest, refreshToken);
router.post('/logout', authenticate, logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, resetPassword);

export default router;

