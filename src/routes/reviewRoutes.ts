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

router.use(protect);


router.get('/', getAllReviews);
router.get('/:id', getReview);

router.use(restrictTo('user'));
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router; 