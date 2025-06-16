import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPlaceSchema, updatePlaceSchema } from '../validation/schemas';
import {
  getAllPlaces,
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
  searchPlaces
} from '../controllers/placeController';

const router = express.Router();

// Public routes
router.get('/place', getAllPlaces);
router.get('/searchPlace', searchPlaces);
router.get('place/:id', getPlace);

// Protected routes
router.use(protect);
router.use(restrictTo('guide', 'admin'));

router.post('/place', validate(createPlaceSchema), restrictTo('admin'), createPlace);
router.patch('/:id', validate(updatePlaceSchema),restrictTo('admin'), updatePlace);
router.delete('/place/:id',restrictTo('admin'), deletePlace);

export default router; 