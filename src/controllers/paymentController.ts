import { Request, Response, NextFunction } from 'express';
import stripe from '../config/stripe';
import { Trip } from '../models/Trip';

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tripId } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Trip #${trip._id}`,
            },
            unit_amount: Math.round(trip.totalCost * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        tripId: trip._id.toString(),
        userId: trip.userId.toString(),
      },
    });

    res.status(200).json({ url: session.url });
    return;
  } catch (error) {
    next(error);
    return; 
  }
};