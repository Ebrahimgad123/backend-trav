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

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Public routes
router.get('/', getAllDrivers);
router.get('/:id', getDriver);

// Driver specific routes
router.patch('/availability', restrictTo('driver'), updateAvailability);

// Admin only routes
router.use(restrictTo('admin'));
router.post('/', createDriver);
router.patch('/:id', updateDriver);
router.delete('/:id', deleteDriver);

export default router; 