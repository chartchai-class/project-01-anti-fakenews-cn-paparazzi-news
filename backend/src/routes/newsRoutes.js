import express from 'express';
import { body } from 'express-validator';
import { 
  getNews, 
  getNewsById, 
  createNews, 
  updateNews, 
  deleteNews, 
  voteNews, 
  updateCredibility 
} from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';
import { createComment, getComments } from '../controllers/commentController.js';

const router = express.Router();

// @route   GET /api/news
// @desc    Get all news with pagination and filtering
router.get('/', getNews);

// @route   GET /api/news/:id
// @desc    Get news by ID
router.get('/:id', getNewsById);

// @route   POST /api/news
// @desc    Create news
router.post('/', protect, authorize('admin', 'fact_checker'), [
  body('title', 'Title is required').not().isEmpty(),
  body('summary', 'Summary is required').not().isEmpty(),
  body('content', 'Content is required').not().isEmpty(),
  body('source', 'Source is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty()
], createNews);

// @route   PUT /api/news/:id
// @desc    Update news
router.put('/:id', protect, authorize('admin', 'fact_checker'), [
  body('title', 'Title is required').optional().not().isEmpty(),
  body('summary', 'Summary is required').optional().not().isEmpty(),
  body('content', 'Content is required').optional().not().isEmpty()
], updateNews);

// @route   DELETE /api/news/:id
// @desc    Delete news
router.delete('/:id', protect, authorize('admin'), deleteNews);

// @route   POST /api/news/:id/vote
// @desc    Vote on news (upvote/downvote)
router.post('/:id/vote', protect, [
  body('voteType', 'Vote type is required').isIn(['upvote', 'downvote'])
], voteNews);

// @route   PUT /api/news/:id/credibility
// @desc    Update credibility score
router.put('/:id/credibility', protect, authorize('admin', 'fact_checker'), [
  body('credibilityScore', 'Credibility score is required and must be between 0 and 100').isInt({ min: 0, max: 100 })
], updateCredibility);

// Comment routes
router.get('/:newsId/comments', getComments);
router.post('/:newsId/comments', protect, [
  body('content', 'Comment content is required').not().isEmpty().isLength({ max: 500 })
], createComment);

export default router;