import express from 'express';
import {
  getAllTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  getUserTrips,
  getMyTrips,
  cancelTrip,
  acceptTrip,
  completeTrip
} from '../controllers/tripController';
import { validate } from '../middleware/validate';
import { protect, restrictTo } from '../middleware/auth';
import { createTripSchema, updateTripSchema } from '../validation/schemas';

const router = express.Router();

router.use(protect);


router.get('/me', getMyTrips);

router.post('/createTrip', restrictTo('user'), validate(createTripSchema), createTrip);
router.get('/', restrictTo('admin'), getAllTrips);
router.get('/user', getUserTrips);
router.route('/:id')
  .get(getTrip)
  .patch(validate(updateTripSchema), updateTrip)
  .delete(deleteTrip);

router.patch('/cancel/:id', restrictTo('user'), cancelTrip);
router.patch('/:id/accept', restrictTo('driver'), acceptTrip);
router.patch('/:id/complete', restrictTo('driver'), completeTrip);

export default router;