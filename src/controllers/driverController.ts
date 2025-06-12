import { Request, Response, NextFunction } from 'express';
import { Driver } from '../models/Driver';
import { AppError } from '../middleware/error';

// Get all drivers
export const getAllDrivers = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const filter = { ...req.query };
    const drivers = await Driver.find(filter);

    res.status(200).json({
      status: 'success',
      results: drivers.length,
      data: {
        drivers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific driver
export const getDriver = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      throw new AppError('No driver found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        driver
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new driver
export const createDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newDriver = await Driver.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        driver: newDriver
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a driver
export const updateDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!driver) {
      throw new AppError('No driver found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        driver
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a driver
export const deleteDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      throw new AppError('No driver found with that ID', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// Update driver availability
export const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.user.id,
      { isAvailable: req.body.isAvailable },
      {
        new: true,
        runValidators: true
      }
    );

    if (!driver) {
      throw new AppError('No driver found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        driver
      }
    });
  } catch (error) {
    next(error);
  }
}; 