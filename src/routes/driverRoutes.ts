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

// Protect all routes after this middleware
router.use(protect);

// Public routes
router.get('/getAll', getAllDrivers);
router.get('/:id', getDriver);

// Driver specific routes
router.patch('/availability', restrictTo('driver'), updateAvailability);

// Admin only routes
router.use(restrictTo('driver', 'admin',"user"));
router.post('/',uploadSingleImage("profileImage"), createDriver);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router; 