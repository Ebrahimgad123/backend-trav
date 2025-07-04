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


router.get('/getAllplaces', getAllPlaces);    
router.get('/searchPlace', searchPlaces);       
router.get('/place/:id', getPlace);            


router.use(protect);                                
router.use(restrictTo('guide', 'admin'));         


router.post(
  '/create',
  restrictTo('admin'),                             
  uploadMultipleImages('images'), 
    parseJSONFields(['location']),                   
  validate(createPlaceSchema),                    
  createPlace
);

router.patch(
  '/:id',
  restrictTo('admin'),                              
  validate(updatePlaceSchema),                     
  updatePlace
);

router.delete(
  '/place/:id',
  restrictTo('admin'),                              
  deletePlace
);

export default router;
