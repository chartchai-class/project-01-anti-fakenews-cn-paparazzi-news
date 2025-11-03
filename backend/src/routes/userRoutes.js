import express from 'express';
import { body } from 'express-validator';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
router.post('/register', [
  body('username', 'Username is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user and get token
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], loginUser);

// @route   GET /api/users/profile
// @desc    Get user profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, [
  body('username', 'Username must be at least 3 characters').optional().isLength({ min: 3 }),
  body('email', 'Please include a valid email').optional().isEmail(),
  body('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 })
], updateUserProfile);

export default router;