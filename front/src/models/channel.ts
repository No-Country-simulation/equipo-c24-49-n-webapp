import { Schema, model, models, Document, Model, Types } from "mongoose";

export interface IChannel extends Document {
  name: string;
  project: Types.ObjectId;
  messages: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface IChannelModel extends Model<IChannel> {
  findByName?(name: string): Promise<IChannel | null>;
}

const ChannelSchema = new Schema<IChannel, IChannelModel>(
  {
    name: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Channel = (models.Channel as IChannelModel) || 
  model<IChannel, IChannelModel>("Channel", ChannelSchema);

export default Channel;