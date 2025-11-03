import Comment from '../models/Comment.js';
import News from '../models/News.js';
import { validationResult } from 'express-validator';

// @desc    Get comments for a news item
// @route   GET /api/news/:newsId/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Check if news exists
    const newsExists = await News.findById(newsId);
    if (!newsExists) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    const comments = await Comment.find({ newsId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate('userId', 'username avatar')
      .populate({ path: 'parentId', populate: { path: 'userId', select: 'username' } });
    
    const total = await Comment.countDocuments({ newsId });
    
    res.json({
      comments,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a comment
// @route   POST /api/news/:newsId/comments
// @access  Private
export const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { newsId } = req.params;
    const { content, parentId } = req.body;
    
    // Check if news exists
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // If replying to a comment, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.newsId.toString() !== newsId) {
        return res.status(400).json({ message: 'Invalid parent comment' });
      }
    }
    
    // Create comment
    const comment = await Comment.create({
      newsId,
      userId: req.user._id,
      content,
      parentId: parentId || null
    });
    
    // Update news comments count
    news.commentsCount += 1;
    await news.save();
    
    // Populate user info
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }
    
    comment.content = content;
    
    const updatedComment = await comment.save();
    
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // Check if user is the author of the comment or admin
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }
    
    // Update news comments count
    const news = await News.findById(comment.newsId);
    if (news) {
      news.commentsCount = Math.max(0, news.commentsCount - 1);
      await news.save();
    }
    
    // Delete comment
    await comment.deleteOne();
    
    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like/dislike a comment
// @route   POST /api/comments/:id/react
// @access  Private
export const reactToComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;
    
    if (!['like', 'dislike'].includes(reactionType)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    // For simplicity, we're just incrementing counts
    // In a real app, you might want to track which users reacted
    if (reactionType === 'like') {
      comment.likes += 1;
    } else {
      comment.dislikes += 1;
    }
    
    await comment.save();
    
    res.json({
      likes: comment.likes,
      dislikes: comment.dislikes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Report a comment
// @route   POST /api/comments/:id/report
// @access  Private
export const reportComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.reported = true;
    comment.reportReason = reason || 'No reason provided';
    
    await comment.save();
    
    res.json({ message: 'Comment reported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};