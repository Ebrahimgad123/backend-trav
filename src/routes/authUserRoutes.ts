import express from 'express';
import { signup, login, getMe } from '../controllers/authUserController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema } from '../validation/schemas';
import { uploadSingleImage } from '../middleware/upload';

const router = express.Router();

router.post('/signup',uploadSingleImage('profileImage'),
  validate(createUserSchema),
  signup
);
router.post('/login',validate(loginUserSchema), login);
router.get('/me', protect, getMe);

export default router; 