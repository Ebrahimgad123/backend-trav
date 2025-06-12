import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { NotificationService } from '../services/notificationService';
import { catchAsync } from '../utils/catchAsync';

export const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await NotificationService.getUserNotifications(req.user.id);

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: notifications
  });
});

export const markNotificationAsRead = catchAsync(async (req: Request, res: Response) => {
  const notification = await NotificationService.markAsRead(
    new Types.ObjectId(req.params.id),
    req.user.id
  );

  res.status(200).json({
    status: 'success',
    data: notification
  });
});

export const markAllNotificationsAsRead = catchAsync(async (req: Request, res: Response) => {
  await NotificationService.markAllAsRead(req.user.id);

  res.status(200).json({
    status: 'success',
    message: 'All notifications marked as read'
  });
}); 