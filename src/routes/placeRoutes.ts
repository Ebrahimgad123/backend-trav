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
import { uploadMultipleImages } from '../middleware/upload';
import { parseJSONFields } from '../middleware/parseJsonFields'
const router = express.Router();


// ─── 🌍 Public Routes ────────────────────────────────────────────────
router.get('/getAllplaces', getAllPlaces);          // Get all places
router.get('/searchPlace', searchPlaces);           // Search places by keyword
router.get('/place/:id', getPlace);                 // Get single place by ID


// ─── 🔐 Protected Routes (Only for logged in users with roles: guide/admin) ──
router.use(protect);                                // Protect all routes after this line
router.use(restrictTo('guide', 'admin'));           // Allow only guides or admins


// ─── 🛠️ Admin-only Routes ─────────────────────────────────────────────
router.post(
  '/create',
  restrictTo('admin'),                               // Admin only
  uploadMultipleImages('images'), 
    parseJSONFields(['location']),                   // Upload images (max 5)
  validate(createPlaceSchema),                       // Validate input
  createPlace
);

router.patch(
  '/:id',
  restrictTo('admin'),                               // Admin only
  validate(updatePlaceSchema),                       // Validate update input
  updatePlace
);

router.delete(
  '/place/:id',
  restrictTo('admin'),                               // Admin only
  deletePlace
);

export default router;
