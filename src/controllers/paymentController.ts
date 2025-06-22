import { Request, Response, NextFunction } from 'express';
import stripe from '../config/stripe';
import { Trip } from '../models/Trip';

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.body;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }

    // 👉 أنشئ PaymentIntent بدلاً من Checkout Session
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(trip.totalCost * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        tripId: trip._id.toString(),
        userId: trip.userId.toString(),
      },
    });

    // 👉 أرجع client secret علشان تكمل الدفع في التطبيق
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
    return;
  }
};
