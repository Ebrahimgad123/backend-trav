import { Request, Response, NextFunction } from 'express';
import { Place } from '../models/Place';
import { AppError } from '../middleware/error';

// Get all places
export const getAllPlaces = async (_req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const places = await Place.find();

    res.json({
      status: 'success',
      results: places.length,
      data: {
        places,
      },
    })
  } catch (error) {
    next(error);
  }
};

// Get place by ID
export const getPlace = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const place = await Place.findById(req.params.id).populate('reviews');

    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        place,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create new place
export const createPlace = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const newPlace = await Place.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        place: newPlace,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update place
export const updatePlace = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        place,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Delete place
export const deletePlace = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    res.json({
      status: 'success',
      data: {
        place,
      },
    })
  } catch (error) {
    next(error);
  }
};

// Search places

export const searchPlaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, city, category } = req.query;
    const query: any = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };

    const places = await Place.find(query);

    res.status(200).json({
      status: 'success',
      results: places.length,
      data: {
        places,
      },
    });
  } catch (error) {
    next(error);
  }
};
