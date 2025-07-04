import Joi from 'joi';
import mongoose from 'mongoose';

// Helper function to validate MongoDB ObjectId
const objectId = Joi.string().custom((value: string, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
});


export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
  phone: Joi.string().pattern(/^[0-9]{10,}$/),
  role: Joi.string().valid('user', 'guide', 'admin').default('user'),
});
export const loginUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,}$/),
  password: Joi.string().min(8),
}).min(1);

// Place Validation Schemas
export const createPlaceSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  city: Joi.string().required(),
  location: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required()
  }).required(),
  description: Joi.string().required().min(10),
  images: Joi.array().items(Joi.string().uri()),
  category: Joi.string().required(),
  price: Joi.number().required().min(0),
  rating: Joi.number().min(0).max(5),
});

export const updatePlaceSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  city: Joi.string(),
  location: Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }),
  description: Joi.string().min(10),
  images: Joi.array().items(Joi.string().uri()),
  category: Joi.string(),
  price: Joi.number().min(0),
  rating: Joi.number().min(0).max(5),
}).min(1);


export const createTripSchema = Joi.object({
  userId: objectId.optional(), 
  selectedPlaces: Joi.array().items(objectId).min(1).required(),
  driverId: objectId,
  totalCost: Joi.number().greater(0).optional(), 
  expectedTime: Joi.string().pattern(/^(\d+h\s*)?(\d+m)?$/).optional(), 
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').default('pending'),
});


export const updateTripSchema = Joi.object({
  selectedPlaces: Joi.array().items(objectId).min(1),
  driverId: objectId,
  totalCost: Joi.number().greater(0),
  expectedTime: Joi.string().pattern(/^(\d+h\s*)?(\d+m)?$/),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled'),
}).min(1);

export const createReviewSchema = Joi.object({
  userId: objectId.required(),
  placeId: objectId.required(),
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required().min(10),
});

export const updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().min(10),
}).min(1);

export const createDriverSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  phone: Joi.string().required().pattern(/^[0-9]{10,}$/),
  carType: Joi.string().required(),
  licensePlate: Joi.string().required(),
  isAvailable: Joi.boolean().default(true),
});

export const updateDriverSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{10,}$/),
  carType: Joi.string(),
  licensePlate: Joi.string(),
  isAvailable: Joi.boolean(),
}).min(1); 