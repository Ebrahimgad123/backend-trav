import { Request, Response, NextFunction } from 'express';
import { DriverReview } from '../models/DriverReview';
import { Trip } from '../models/Trip';
import { AppError } from '../middleware/error';
import { catchAsync } from '../utils/catchAsync';

// Create a new driver review
export const createDriverReview = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if trip exists and belongs to user
  const trip = await Trip.findOne({
    _id: req.body.tripId,
    userId: req.user.id,
    status: 'completed'
  });

  if (!trip) {
    return next(new AppError('Trip not found or not completed', 404));
  }

  // Check if review already exists
  const existingReview = await DriverReview.findOne({
    tripId: req.body.tripId,
    userId: req.user.id
  });

  if (existingReview) {
    return next(new AppError('You have already reviewed this trip', 400));
  }

  const review = await DriverReview.create({
    ...req.body,
    userId: req.user.id,
    driverId: trip.driverId
  });

  res.status(201).json({
    status: 'success',
    data: review
  });
});

// Get all reviews for a driver
export const getDriverReviews = catchAsync(async (
  req: Request,
  res: Response
) => {
  const reviews = await DriverReview.find({ driverId: req.params.driverId })
    .populate('userId', 'name')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});

// Update review
export const updateDriverReview = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const review = await DriverReview.findOne({
    _id: req.params.reviewId,
    userId: req.user.id
  });

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  Object.assign(review, req.body);
  await review.save();

  res.status(200).json({
    status: 'success',
    data: review
  });
});

// Delete review
export const deleteDriverReview = catchAsync(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const review = await DriverReview.findOne({
    _id: req.params.reviewId,
    userId: req.user.id
  });

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  await review.deleteOne();

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 