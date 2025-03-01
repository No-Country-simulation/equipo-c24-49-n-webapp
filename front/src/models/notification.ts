import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al usuario que recibe la notificación
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    type: {
      type: String,
      enum: ["assignment", "comment", "status_change"], // Tipos de notificaciones
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

const Notification = models.Notification || model("Notification", NotificationSchema);
export default Notification;