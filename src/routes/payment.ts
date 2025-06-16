import express from 'express';
import { protect } from '../middleware/auth';
import { createCheckoutSession } from '../controllers/paymentController';

const router = express.Router();

router.post('/checkout', protect, createCheckoutSession);

export default router;