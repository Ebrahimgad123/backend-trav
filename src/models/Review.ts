import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
  placeId: {
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, 'Review must belong to a place'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please provide a rating'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
  },
}, {
  timestamps: true,
});

// Prevent user from submitting more than one review per place
reviewSchema.index({ placeId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRating = async function(placeId) {
  const stats = await this.aggregate([
    {
      $match: { placeId: placeId }
    },
    {
      $group: {
        _id: '$placeId',
        avgRating: { $avg: '$rating' },
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Place').findByIdAndUpdate(placeId, {
      rating: stats[0].avgRating
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', function() {
  // @ts-ignore
  this.constructor.calcAverageRating(this.placeId);
});

export const Review = mongoose.model<IReview>('Review', reviewSchema); 