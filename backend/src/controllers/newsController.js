import News from '../models/News.js';
import Source from '../models/Source.js';
import { validationResult } from 'express-validator';

// @desc    Get all news with pagination and filtering
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, source, search, sortBy = 'publishDate', order = 'desc' } = req.query;
    
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (source) {
      query.source = source;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const news = await News.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOptions)
      .populate('factCheckerId', 'username');
    
    const total = await News.countDocuments(query);
    
    res.json({
      news,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get news by ID
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('factCheckerId', 'username email');
    
    if (news) {
      res.json(news);
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create news
// @route   POST /api/news
// @access  Private (Admin or Fact Checker)
export const createNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, summary, content, source, sourceUrl, category, image } = req.body;
    
    // Create news
    const news = await News.create({
      title,
      summary,
      content,
      source,
      sourceUrl,
      category,
      image,
      factChecked: req.user.role === 'fact_checker' || req.user.role === 'admin',
      factCheckerId: req.user.role === 'fact_checker' || req.user.role === 'admin' ? req.user._id : null,
      factCheckDate: req.user.role === 'fact_checker' || req.user.role === 'admin' ? Date.now() : null
    });
    
    // Update source news count
    await Source.findOneAndUpdate(
      { name: source },
      { $inc: { newsCount: 1 } },
      { upsert: true }
    );
    
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (Admin or Fact Checker)
export const updateNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Update news fields
    Object.assign(news, req.body);
    
    // If updated by fact checker or admin, mark as fact checked
    if (req.user.role === 'fact_checker' || req.user.role === 'admin') {
      news.factChecked = true;
      news.factCheckerId = req.user._id;
      news.factCheckDate = Date.now();
    }
    
    const updatedNews = await news.save();
    
    res.json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (Admin)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Update source news count
    await Source.findOneAndUpdate(
      { name: news.source },
      { $inc: { newsCount: -1 } }
    );
    
    await news.deleteOne();
    
    res.json({ message: 'News removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Vote on news (upvote/downvote)
// @route   POST /api/news/:id/vote
// @access  Private
export const voteNews = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Check if user has already voted
    const existingVote = news.voters.find(v => v.userId.toString() === req.user._id.toString());
    
    if (existingVote) {
      // If user is changing vote
      if (existingVote.voteType !== voteType) {
        // Remove old vote
        if (existingVote.voteType === 'upvote') {
          news.upvotes -= 1;
        } else {
          news.downvotes -= 1;
        }
        
        // Add new vote
        existingVote.voteType = voteType;
        if (voteType === 'upvote') {
          news.upvotes += 1;
        } else {
          news.downvotes += 1;
        }
      } else {
        // User is voting the same way again, remove vote
        if (voteType === 'upvote') {
          news.upvotes -= 1;
        } else {
          news.downvotes -= 1;
        }
        news.voters = news.voters.filter(v => v.userId.toString() !== req.user._id.toString());
      }
    } else {
      // New vote
      news.voters.push({
        userId: req.user._id,
        voteType
      });
      
      if (voteType === 'upvote') {
        news.upvotes += 1;
      } else {
        news.downvotes += 1;
      }
    }
    
    await news.save();
    
    res.json({
      upvotes: news.upvotes,
      downvotes: news.downvotes,
      voters: news.voters
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update credibility score
// @route   PUT /api/news/:id/credibility
// @access  Private (Fact Checker or Admin)
export const updateCredibility = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { credibilityScore } = req.body;
    
    if (credibilityScore < 0 || credibilityScore > 100) {
      return res.status(400).json({ message: 'Credibility score must be between 0 and 100' });
    }
    
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    // Determine credibility level based on score
    let credibilityLevel;
    if (credibilityScore >= 80) credibilityLevel = 'Very High';
    else if (credibilityScore >= 60) credibilityLevel = 'High';
    else if (credibilityScore >= 40) credibilityLevel = 'Medium';
    else if (credibilityScore >= 20) credibilityLevel = 'Low';
    else credibilityLevel = 'Very Low';
    
    news.credibilityScore = credibilityScore;
    news.credibilityLevel = credibilityLevel;
    news.factChecked = true;
    news.factCheckerId = req.user._id;
    news.factCheckDate = Date.now();
    
    const updatedNews = await news.save();
    
    res.json({
      credibilityScore: updatedNews.credibilityScore,
      credibilityLevel: updatedNews.credibilityLevel,
      factChecked: updatedNews.factChecked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};