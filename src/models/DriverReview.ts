import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';

export interface IDriverReview extends Document {
  userId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const driverReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  tripId: {
    type: Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews for the same trip
driverReviewSchema.index({ userId: 1, tripId: 1 }, { unique: true });

// Calculate average rating for driver
driverReviewSchema.statics.calculateAverageRating = async function(driverId) {
  const stats = await this.aggregate([
    {
      $match: { driverId: new mongoose.Types.ObjectId(driverId) }
    },
    {
      $group: {
        _id: '$driverId',
        averageRating: { $avg: '$rating' },
        numberOfReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Driver').findByIdAndUpdate(driverId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      numberOfReviews: stats[0].numberOfReviews
    });
  }
};

// Update driver stats after review
driverReviewSchema.post('save', function() {
  // @ts-ignore
  this.constructor.calculateAverageRating(this.driverId);
});

export const driverReviewValidation = {
  create: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required().min(3).max(500),
    tripId: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/)
  })
};

export const DriverReview = mongoose.model<IDriverReview>('DriverReview', driverReviewSchema); 