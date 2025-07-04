import express from 'express';
import { protect } from '../middleware/auth';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/notificationController';

const router = express.Router();

router.use(protect); 

router
  .route('/')
  .get(getMyNotifications);

router
  .route('/mark-all-read')
  .post(markAllNotificationsAsRead);

router
  .route('/:id')
  .patch(markNotificationAsRead);

export default router; 