import mongoose, { Document, Schema } from 'mongoose';

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId;
  selectedPlaces: mongoose.Types.ObjectId[];
  driverId?: mongoose.Types.ObjectId;
  totalCost: number;
  expectedTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const tripSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    
  },
  selectedPlaces: [{
    type: Schema.Types.ObjectId,
    ref: 'Place',
    required: [true, 'Trip must have at least one place'],
  }],
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver',
  },
  totalCost: {
    type: Number,
    required: [true, 'Trip must have a total cost'],
    min: [0, 'Total cost cannot be negative'],
    validate: {
      validator: function(value: number) {
        return value > 0;
      },
      message: 'Total cost must be greater than 0'
    }
  },
  expectedTime: {
    type: String,
    required: [true, 'Trip must have an expected time'],
    validate: {
      validator: function(value: string) {
        return /^(\d+h\s*)?(\d+m)?$/.test(value.trim());
      },
      message: 'Expected time format should be like "2h 30m" or "45m" or "3h"'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
  }
}, {
  timestamps: true,
});

tripSchema.path('selectedPlaces').validate(function(value: mongoose.Types.ObjectId[]) {
  if (!value || value.length === 0) {
    throw new Error('Trip must have at least one place');
  }
  return true;
});

tripSchema.pre('save', function(this: ITrip, next: () => void) {
  if (this.status === 'confirmed' && !this.driverId) {
    throw new Error('Trip cannot be confirmed without assigning a driver');
  }
  next();
});

tripSchema.pre(/^find/, function(this: any, next: () => void) {
  this.populate({
    path: 'selectedPlaces',
    select: 'name city location'
  }).populate({
    path: 'driverId',
    select: 'name phone carType'
  });
  
  next();
});

export const Trip = mongoose.model<ITrip>('Trip', tripSchema); 