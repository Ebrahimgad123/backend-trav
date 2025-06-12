import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'trip' | 'review' | 'system';
  isRead: boolean;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['trip', 'review', 'system'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'type'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema); 