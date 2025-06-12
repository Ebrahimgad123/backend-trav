import { Notification } from '../models/Notification';
import { Types } from 'mongoose';

export class NotificationService {
  static async createNotification(data: {
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: 'trip' | 'review' | 'system';
    relatedId?: Types.ObjectId;
  }) {
    return await Notification.create(data);
  }

  static async getUserNotifications(userId: Types.ObjectId) {
    return await Notification.find({ userId })
      .sort('-createdAt')
      .limit(50);
  }

  static async markAsRead(notificationId: Types.ObjectId, userId: Types.ObjectId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
  }

  static async markAllAsRead(userId: Types.ObjectId) {
    return await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  // Notification templates
  static async notifyTripStatusChange(tripId: Types.ObjectId, userId: Types.ObjectId, status: string) {
    return await this.createNotification({
      userId,
      title: 'Trip Status Update',
      message: `Your trip status has been updated to ${status}`,
      type: 'trip',
      relatedId: tripId
    });
  }

  static async notifyNewReview(reviewId: Types.ObjectId, userId: Types.ObjectId) {
    return await this.createNotification({
      userId,
      title: 'New Review',
      message: 'You have received a new review',
      type: 'review',
      relatedId: reviewId
    });
  }

  static async notifySystemMessage(userId: Types.ObjectId, message: string) {
    return await this.createNotification({
      userId,
      title: 'System Notification',
      message,
      type: 'system'
    });
  }
} 