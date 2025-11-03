import express from 'express';
import userRoutes from './userRoutes.js';
import newsRoutes from './newsRoutes.js';
import commentRoutes from './commentRoutes.js';
import sourceRoutes from './sourceRoutes.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/comments', commentRoutes);
router.use('/sources', sourceRoutes);

export default router;