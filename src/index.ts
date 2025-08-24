import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { connectDB } from './config/database';
import { globalErrorHandler, AppError } from './middleware/error';
import { configSecurity } from './middleware/security';
// Import routes
import authRoutes from './routes/authUserRoutes';
import placeRoutes from './routes/placeRoutes';
import reviewRoutes from './routes/reviewRoutes';
import tripRoutes from './routes/tripRoutes';
import driverRoutes from './routes/driverRoutes';
import userRoutes from './routes/userRoutes';
import driverReviewRoutes from './routes/driverReviewRoutes';
import notificationRoutes from './routes/notificationRoutes';
import paymentRoutes from './routes/payment';
import googleAuthRoutes from './routes/googleAuthRoutes';
import session from 'express-session';
import passport from './middleware/passport';
import { connectRedis } from './config/RedisConfig';
// ...existing code...
connectRedis();
// Create Express app
const app = express();
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
// Connect to MongoDB
connectDB();

// Apply security configurations
configSecurity(app);

// Additional middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Tourism API',
    documentation: '/api-docs'
  });
});

// Routes
app.use('/google', googleAuthRoutes);
app.use('/auth', authRoutes);
app.use('/places', placeRoutes);
app.use('/review', reviewRoutes);
app.use('/trip', tripRoutes);
app.use('/driver', driverRoutes);
app.use('/user', userRoutes);
app.use('/driverReview', driverReviewRoutes);
app.use('/notification', notificationRoutes);
app.use('/payment', paymentRoutes);
// ...existing code...
// Handle undefined routes
app.use('*', (_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

// Error handling
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 