import { Document, Schema, model, InferSchemaType, Types } from "mongoose";
import { MessageStatus } from "../utils/constant";

const chatSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ updatedAt: -1 });

export interface IChat extends InferSchemaType<typeof chatSchema>, Document {
  _id: Types.ObjectId;
}

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
