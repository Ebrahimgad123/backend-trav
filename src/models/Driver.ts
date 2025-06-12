import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  phone: string;
  hasCar: boolean;
  rating: number;
  carType?: string;
  pricePerHour: number;
  profileImage: string;
  isAvailable: boolean;
}

const driverSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide driver name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    unique: true,
  },
  hasCar: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  carType: {
    type: String,
    required: [
      function(this: { hasCar: boolean }) {
        return this.hasCar;
      },
      'Car type is required when driver has a car'
    ],
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Please provide price per hour'],
    min: 0,
  },
  profileImage: {
    type: String,
    default: 'default.jpg',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

// Index for searching available drivers
driverSchema.index({ isAvailable: 1, hasCar: 1 });

export const Driver = mongoose.model<IDriver>('Driver', driverSchema); 