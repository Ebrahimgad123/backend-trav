import express from 'express';
import {getAllTrips,getTrip,createTrip,updateTrip,deleteTrip,getUserTrips,getMyTrips,cancelTrip,acceptTrip,completeTrip} from '../controllers/tripController';
import { validate } from '../middleware/validate';
import { protect, restrictTo } from '../middleware/auth';
import { createTripSchema, updateTripSchema } from '../validation/schemas';

const router = express.Router();

// كل المستخدمين لازم يكونوا مسجلين دخول
router.use(protect);

// ========== رحلات المستخدم الحالي ==========
router.get('/me', getMyTrips);

// ========== إدارة الرحلات ==========
router.get('/', restrictTo('admin'), getAllTrips);
router.post('/',validate(createTripSchema), createTrip);
router.get('/user', getUserTrips);
router.route('/:id').get(getTrip).patch(validate(updateTripSchema),updateTrip).delete(deleteTrip);

// ========== إجراءات الرحلات ==========
router.patch('/cancel/:id',restrictTo('user'), cancelTrip);
router.patch('/:id/accept', restrictTo('driver'), acceptTrip);
router.patch('/:id/complete', restrictTo('driver'), completeTrip);

export default router;
