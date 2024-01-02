import { InferSchemaType, Schema, Types, model } from "mongoose";
import { MessageStatus } from "../utils/constant";

const chatMessageSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
    },
  },
  {
    timestamps: true,
  }
);

chatMessageSchema.index({ createdAt: -1 });

export interface IChatMessage
  extends InferSchemaType<typeof chatMessageSchema>,
    Document {
  _id: Types.ObjectId;
}

const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);

export default ChatMessage;
