import express from 'express';
import { register, login } from '../controllers/authController.js';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validator.js';


const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().trim(),
  body('role').optional().isIn(['buyer', 'seller', 'broker']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

export default router;

