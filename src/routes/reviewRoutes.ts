import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(protect);

// Routes
router.get('/', getAllReviews);
router.get('/:id', getReview);

// Only tourists can create, update and delete reviews
router.use(restrictTo('user'));
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router; 