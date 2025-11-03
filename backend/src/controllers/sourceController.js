import Source from '../models/Source.js';
import { validationResult } from 'express-validator';

// @desc    Get all sources
// @route   GET /api/sources
// @access  Public
export const getSources = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'name', order = 'asc' } = req.query;
    
    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const sortOptions = {};
    sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    
    const sources = await Source.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort(sortOptions);
    
    const total = await Source.countDocuments(query);
    
    res.json({
      sources,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get source by ID
// @route   GET /api/sources/:id
// @access  Public
export const getSourceById = async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    
    if (source) {
      res.json(source);
    } else {
      res.status(404).json({ message: 'Source not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create source
// @route   POST /api/sources
// @access  Private (Admin or Fact Checker)
export const createSource = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, url, description, type, bias } = req.body;
    
    // Check if source already exists
    const sourceExists = await Source.findOne({ name });
    
    if (sourceExists) {
      return res.status(400).json({ message: 'Source already exists' });
    }
    
    // Create source
    const source = await Source.create({
      name,
      url,
      description,
      type,
      bias,
      verified: req.user.role === 'admin',
      verifiedBy: req.user.role === 'admin' ? req.user._id : null,
      verifiedDate: req.user.role === 'admin' ? Date.now() : null
    });
    
    res.status(201).json(source);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update source
// @route   PUT /api/sources/:id
// @access  Private (Admin or Fact Checker)
export const updateSource = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const source = await Source.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }
    
    // Update source fields
    Object.assign(source, req.body);
    
    // If updated by admin, mark as verified
    if (req.user.role === 'admin') {
      source.verified = true;
      source.verifiedBy = req.user._id;
      source.verifiedDate = Date.now();
    }
    
    // Update credibility level based on score if provided
    if (req.body.credibilityScore !== undefined) {
      const score = req.body.credibilityScore;
      if (score >= 80) source.credibilityLevel = 'Very High';
      else if (score >= 60) source.credibilityLevel = 'High';
      else if (score >= 40) source.credibilityLevel = 'Medium';
      else if (score >= 20) source.credibilityLevel = 'Low';
      else source.credibilityLevel = 'Very Low';
    }
    
    const updatedSource = await source.save();
    
    res.json(updatedSource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete source
// @route   DELETE /api/sources/:id
// @access  Private (Admin)
export const deleteSource = async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }
    
    await source.deleteOne();
    
    res.json({ message: 'Source removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify source
// @route   PUT /api/sources/:id/verify
// @access  Private (Admin)
export const verifySource = async (req, res) => {
  try {
    const source = await Source.findById(req.params.id);
    
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }
    
    source.verified = true;
    source.verifiedBy = req.user._id;
    source.verifiedDate = Date.now();
    
    const updatedSource = await source.save();
    
    res.json({
      _id: updatedSource._id,
      name: updatedSource.name,
      verified: updatedSource.verified
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top credible sources
// @route   GET /api/sources/top
// @access  Public
export const getTopSources = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const sources = await Source.find({ verified: true })
      .sort({ credibilityScore: -1 })
      .limit(limit);
    
    res.json(sources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};