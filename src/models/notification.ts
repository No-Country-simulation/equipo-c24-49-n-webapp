import  { Schema, model, models, Document, Model, Types } from "mongoose";

export interface INotification extends Document {
  message: string;
  user: Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface INotificationModel extends Model<INotification> {
  findByMessage?(message: string): Promise<INotification | null>;
}

const NotificationSchema = new Schema<INotification, INotificationModel>(
  {
    message: {
      type: String,
      required: [true, "Notification message is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = (models.Notification as INotificationModel) || 
  model<INotification, INotificationModel>("Notification", NotificationSchema);

export default Notification;