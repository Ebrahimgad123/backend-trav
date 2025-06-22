import express from 'express';
import { protect } from '../middleware/auth';
import { createPaymentIntent } from '../controllers/paymentController';

const router = express.Router();

router.post('/checkout', protect, createPaymentIntent);

export default router;