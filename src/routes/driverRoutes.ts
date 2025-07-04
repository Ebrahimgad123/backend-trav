import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getAllDrivers,
  getDriver,
  createDriver,
  updateDriver,
  deleteDriver,
  updateAvailability
} from '../controllers/driverController';
import { uploadSingleImage } from '../middleware/upload';

const router = express.Router();


router.use(protect);


router.get('/getAll', getAllDrivers);
router.get('/:id', getDriver);

router.patch('/availability', restrictTo('driver'), updateAvailability);

router.use(restrictTo('driver', 'admin'));
router.post('/',uploadSingleImage("profileImage"), createDriver);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router; 