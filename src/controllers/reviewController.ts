import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review';
import { AppError } from '../middleware/error';

// Get all reviews
export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let filter = {};
    if (req.params.placeId) filter = { placeId: req.params.placeId };

    const reviews = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific review
export const getReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      throw new AppError('No review found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new review
export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Allow nested routes
    if (!req.body.placeId) req.body.placeId = req.params.placeId;
    if (!req.body.userId) req.body.userId = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!review) {
      throw new AppError('No review found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a review
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!review) {
      throw new AppError('No review found with that ID', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
}; 