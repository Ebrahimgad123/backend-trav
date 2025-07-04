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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(trip.totalCost * 100), 
      currency: 'usd',
      metadata: {
        tripId: trip._id.toString(),
        userId: trip.userId.toString(),
      },
    });

   
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
    return;
  }
};
