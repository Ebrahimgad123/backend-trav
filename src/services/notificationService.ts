import { Notification } from '../models/Notification';
import { Types } from 'mongoose';
import admin from '../config/firbase';
import { User } from '../models/User';

export class NotificationService {
  static async createNotification(data: {
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: 'trip' | 'review' | 'system';
    relatedId?: Types.ObjectId;
  }) {
    const notification = await Notification.create(data);

    const user = await User.findById(data.userId);
    if (user?.fcmToken) {
      await admin.messaging().send({
        token: user.fcmToken,
        notification: {
          title: data.title,
          body: data.message,
        },
        data: {
          type: data.type,
          relatedId: data.relatedId?.toString() || '',
        },
      });
    }

    return notification;
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


// ⑤ React Native – إرسال الـ Token:
// ts
// Copy
// Edit
// // services/api.js
// import axios from 'axios';

// export const updateFcmToken = async (token) => {
//   const res = await axios.patch('http://<your-api-url>/api/users/update-fcm-token', {
//     fcmToken: token,
//   }, {
//     headers: {
//       Authorization: `Bearer ${yourAuthToken}`,
//     },
//   });

//   return res.data;
// };
// ts
// Copy
// Edit
// // App.js or useEffect hook
// import messaging from '@react-native-firebase/messaging';
// import { updateFcmToken } from './services/api';

// useEffect(() => {
//   messaging()
//     .getToken()
//     .then(token => {
//       updateFcmToken(token);
//     });

//   return messaging().onTokenRefresh(token => {
//     updateFcmToken(token);
//   });
// }, []);
// ✅ كده كل حاجة مربوطة:
// المستخدم يرسل التوكن أول ما يفتح التطبيق.

// السيرفر يحتفظ بالتوكن.

// عند أي حدث (رحلة اتلغت، مراجعة جديدة)، السيرفر يرسل إشعار فعلي للموبايل مباشرة.

// تحب أساعدك في:

// إنشاء رسالة اختبارية (test push)?

// استقبال الإشعار في React Native من onMessage؟

// أو تصميم Notification UI؟
// قلّي بس ❤️