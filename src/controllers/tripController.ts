import { Request, Response, NextFunction } from 'express';
import { Trip } from '../models/Trip';
import { AppError } from '../middleware/error';
import { IUser } from '../models/User';
import { NotificationService } from '../services/notificationService';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all trips (admin only)
export const getAllTrips = async (_req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name email')
      .populate('selectedPlaces', 'name city')
      .populate('driverId', 'name phone carType');

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get trip by ID
export const getTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('selectedPlaces', 'name city')
      .populate('driverId', 'name phone carType');

    if (!trip) {
      throw new AppError('No trip found with that ID', 404);
    }

    // Check if user has permission to view this trip
    if (
      trip.userId.toString() !== req.user?._id.toString() &&
      req.user?.role !== 'admin' &&
      trip.driverId?.toString() !== req.user?._id.toString()
    ) {
      throw new AppError('You do not have permission to view this trip', 403);
    }

    res.status(200).json({
      status: 'success',
      data: {
        trip,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new trip
export const createTrip = async (req: AuthRequest,res: Response,next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('You must be logged in to create a trip', 401);
    }

    const newTrip = await Trip.create({
      ...req.body,
      userId: req.user._id,
      status: 'pending',
    });

    const trip = await Trip.findById(newTrip._id)
      .populate('selectedPlaces', 'name city')
      .populate('driverId', 'name phone carType');

    res.status(201).json({
      status: 'success',
      data: {
        trip,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update trip
export const updateTrip = async (req: AuthRequest,res: Response,next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('You must be logged in to update a trip', 401);
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      throw new AppError('No trip found with that ID', 404);
    }

    // Check permissions based on user role and trip status
    if (req.user.role === 'admin') {
      // Admin can update any trip
    } else if (req.user.role === 'driver' && trip.driverId?.toString() === req.user._id.toString()) {
      // Driver can only update their assigned trips and only the status
      if (Object.keys(req.body).some(key => key !== 'status')) {
        throw new AppError('Drivers can only update trip status', 403);
      }
    } else if (trip.userId.toString() === req.user._id.toString()) {
      // Trip owner can update only if trip is pending
      if (trip.status !== 'pending') {
        throw new AppError('Cannot update trip after it has been confirmed', 403);
      }
    } else {
      throw new AppError('You do not have permission to update this trip', 403);
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'name email')
      .populate('selectedPlaces', 'name city')
      .populate('driverId', 'name phone carType');

    res.status(200).json({
      status: 'success',
      data: {
        trip: updatedTrip,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete trip
export const deleteTrip = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('You must be logged in to delete a trip', 401);
    }

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      throw new AppError('No trip found with that ID', 404);
    }

    // Only allow trip owner or admin to delete the trip
    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      throw new AppError('You do not have permission to delete this trip', 403);
    }

    // Only allow deletion of pending trips
    if (trip.status !== 'pending') {
      throw new AppError('Cannot delete trip after it has been confirmed', 403);
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's trips
export const getUserTrips = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('You must be logged in to view trips', 401);
    }

    let query = {};

    // If user is a driver, show their assigned trips
    if (req.user.role === 'driver') {
      query = { driverId: req.user._id };
    } else {
      // For regular users, show their created trips
      query = { userId: req.user._id };
    }

    const trips = await Trip.find(query)
      .populate('userId', 'name email')
      .populate('selectedPlaces', 'name city')
      .populate('driverId', 'name phone carType');

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all trips for the current user
export const getMyTrips = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const trips = await Trip.find({ userId: req.user.id });

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel a trip
export const cancelTrip = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!trip) throw new AppError('No trip found with that ID', 404);

    // Send notification
    await NotificationService.notifyTripStatusChange(trip._id, trip.userId as any, 'cancelled');

    res.status(200).json({ status: 'success', data: { trip } });
  } catch (error) {
    next(error);
  }
};

// Driver accepts a trip
export const acceptTrip = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { driverId: req.user!.id, status: 'confirmed' },
      { new: true, runValidators: true }
    );

    if (!trip) throw new AppError('No trip found with that ID', 404);

    // Send notification
    await NotificationService.notifyTripStatusChange(trip._id, trip.userId as any, 'confirmed');

    res.status(200).json({ status: 'success', data: { trip } });
  } catch (error) {
    next(error);
  }
};

// Driver completes a trip
export const completeTrip = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, driverId: req.user!.id, status: 'confirmed' },
      { status: 'completed' },
      { new: true }
    );

    if (!trip) throw new AppError('No trip found with that ID', 404);

    // Send notification
    await NotificationService.notifyTripStatusChange(trip._id, trip.userId as any, 'completed');

    res.status(200).json({ status: 'success', data: { trip } });
  } catch (error) {
    next(error);
  }
};