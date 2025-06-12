import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validation/schemas';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe
} from '../controllers/userController';

const router = express.Router();

// Public routes
router.post('/signup', validate(createUserSchema), createUser);

// Protect all routes after this middleware
router.use(protect);

// Current user routes
router.get('/me', getMe);
router.patch('/updateMe', validate(updateUserSchema), updateMe);
router.delete('/deleteMe', deleteMe);

// Admin only routes
router.use(restrictTo('admin'));
router.route('/')
  .get(getAllUsers)
  .post(validate(createUserSchema), createUser);

router.route('/:id')
  .get(getUser)
  .patch(validate(updateUserSchema), updateUser)
  .delete(deleteUser);

export default router; 