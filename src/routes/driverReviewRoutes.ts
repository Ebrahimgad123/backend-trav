import express from 'express';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { driverReviewValidation } from '../models/DriverReview';
import {createDriverReview, getDriverReviews,updateDriverReview,deleteDriverReview} from '../controllers/driverReviewController';

const router = express.Router();

router.use(protect); // All routes require authentication

router
  .route('/')
  .post(validate(driverReviewValidation.create), createDriverReview);

router
  .route('/driver/:driverId')
  .get(getDriverReviews);

router
  .route('/:reviewId')
  .patch(updateDriverReview)
  .delete(deleteDriverReview);

export default router; 