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
// ...existing code...
import googleAuthRoutes from './routes/googleAuthRoutes';
import session from 'express-session';
import passport from './middleware/passport';


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
app.use('/', googleAuthRoutes);
app.use('/', authRoutes);
app.use('/', placeRoutes);
app.use('/', reviewRoutes);
app.use('/trip', tripRoutes);
app.use('/', driverRoutes);
app.use('/', userRoutes);
app.use('/', driverReviewRoutes);
app.use('/', notificationRoutes);

// ...existing code...
// Handle undefined routes
app.all('*', (_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

// Error handling
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 