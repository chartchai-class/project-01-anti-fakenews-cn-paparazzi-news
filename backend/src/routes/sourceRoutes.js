import express from 'express';
import { body } from 'express-validator';
import { 
  getSources, 
  getSourceById, 
  createSource, 
  updateSource, 
  deleteSource, 
  verifySource,
  getTopSources
} from '../controllers/sourceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/sources
// @desc    Get all sources
router.get('/', getSources);

// @route   GET /api/sources/top
// @desc    Get top credible sources
router.get('/top', getTopSources);

// @route   GET /api/sources/:id
// @desc    Get source by ID
router.get('/:id', getSourceById);

// @route   POST /api/sources
// @desc    Create source
router.post('/', protect, authorize('admin', 'fact_checker'), [
  body('name', 'Source name is required').not().isEmpty(),
  body('type', 'Source type is required').optional().isIn(['Mainstream', 'Alternative', 'Social Media', 'Blog', 'Government', 'International']),
  body('bias', 'Bias type is required').optional().isIn(['Left', 'Center-Left', 'Center', 'Center-Right', 'Right', 'Neutral', 'Unknown'])
], createSource);

// @route   PUT /api/sources/:id
// @desc    Update source
router.put('/:id', protect, authorize('admin', 'fact_checker'), [
  body('name', 'Source name is required').optional().not().isEmpty(),
  body('credibilityScore', 'Credibility score must be between 0 and 100').optional().isInt({ min: 0, max: 100 })
], updateSource);

// @route   DELETE /api/sources/:id
// @desc    Delete source
router.delete('/:id', protect, authorize('admin'), deleteSource);

// @route   PUT /api/sources/:id/verify
// @desc    Verify source
router.put('/:id/verify', protect, authorize('admin'), verifySource);

export default router;