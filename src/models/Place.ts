import mongoose, { Document, Schema } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  city: string;
  description: string;
  images: string[];
  rating: number;
  category: string;
  price: number;
  location: {
    type: string;
    coordinates: number[];
  };
}

const placeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a place name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    minlength: [10, 'Description must be at least 10 characters long']
  },
  images: [{
    type: String,
    required: [true, 'Please provide at least one image']
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v: number[]) {
          return v.length === 2;
        },
        message: 'Location must have exactly 2 coordinates [longitude, latitude]'
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
placeSchema.index({ location: '2dsphere' });

// Virtual populate reviews
placeSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'placeId'
});

export const Place = mongoose.model<IPlace>('Place', placeSchema); 