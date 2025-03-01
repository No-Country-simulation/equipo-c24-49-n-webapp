import { Schema, model, models } from "mongoose";

const ChannelSchema = new Schema(
  {
    project_id: {
      type: Schema.Types.ObjectId,
      ref: "Project", // Referencia al proyecto del canal
      required: true,
    },
    name: {
      type: String,
      required: [true, "Channel name is required"],
    },
    messages: [
      {
        author: {
          type: Schema.Types.ObjectId,
          ref: "User", // Referencia al usuario que envió el mensaje
          required: true,
        },
        content: {
          type: String,
          required: [true, "Message content is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Channel = models.Channel || model("Channel", ChannelSchema);
export default Channel;