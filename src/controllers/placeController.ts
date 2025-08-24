import { Request, Response, NextFunction } from 'express';
import { Place } from '../models/Place';
import { AppError } from '../middleware/error';
import { redisClient } from '../config/RedisConfig'; // تأكد أن اسم التصدير صحيح

export const getAllPlaces = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cached = await redisClient.get('all_places');
    if (cached) {
      res.json({
        status: 'success from cache',
        results: JSON.parse(cached).length,
        data: { places: JSON.parse(cached) },
        cached: true
      });
      return;
    }

    const places = await Place.find();
    await redisClient.setEx('all_places', 300, JSON.stringify(places));

    res.json({
      status: 'success from database',
      results: places.length,
      data: { places },
      cached: false
    });
  } catch (error) {
    next(error);
  }
};

export const getPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const placeId = req.params.id;
    const cacheKey = `place:${placeId}`;

    const dataCached = await redisClient.get(cacheKey);
    if (dataCached) {
      const place = JSON.parse(dataCached);
      res.status(200).json({
        status: 'success from cache',
        data: { place },
        cached: true
      });
      return;
    }

    const place = await Place.findById(placeId).populate('reviews');
    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(place));

    res.status(200).json({
      status: 'success from database',
      data: { place },
      cached: false
    });
  } catch (error) {
    next(error);
  }
};

export const createPlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const images = (req.files as Express.Multer.File[])?.map(file =>`${process.env.BACKEND_URL}/uploads/${file.filename}`);

    const newPlace = await Place.create({
      ...req.body,
      images,
    });

    // امسح كاش الأماكن
    await redisClient.del('all_places');

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

export const updatePlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    // امسح كاش المكان وكاش كل الأماكن
    await redisClient.del('all_places');
    await redisClient.del(`place:${req.params.id}`);

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

export const deletePlace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (!place) {
      throw new AppError('No place found with that ID', 404);
    }

    // امسح كاش المكان وكاش كل الأماكن
    await redisClient.del('all_places');
    await redisClient.del(`place:${req.params.id}`);

    res.json({
      status: 'success',
      data: {
        place,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const searchPlaces = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, city, category } = req.query;
    const query: any = {};

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { description: { $regex: name, $options: 'i' } }
      ];
    }
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
