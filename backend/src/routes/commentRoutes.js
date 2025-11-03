import express from 'express';
import { body } from 'express-validator';
import { 
  updateComment, 
  deleteComment, 
  reactToComment, 
  reportComment 
} from '../controllers/commentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   PUT /api/comments/:id
// @desc    Update a comment
router.put('/:id', protect, [
  body('content', 'Comment content is required').not().isEmpty().isLength({ max: 500 })
], updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
router.delete('/:id', protect, deleteComment);

// @route   POST /api/comments/:id/react
// @desc    Like/dislike a comment
router.post('/:id/react', protect, [
  body('reactionType', 'Reaction type is required').isIn(['like', 'dislike'])
], reactToComment);

// @route   POST /api/comments/:id/report
// @desc    Report a comment
router.post('/:id/report', protect, [
  body('reason', 'Report reason is required').optional().isLength({ max: 200 })
], reportComment);

export default router;