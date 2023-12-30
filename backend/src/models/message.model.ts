import { InferSchemaType, Schema, Types, model } from "mongoose";
import { MessageStatus } from "../utils/constant";

const messageSchema = new Schema(
  {
    conversationId: {
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

messageSchema.index({ createdAt: -1 });

export interface IMessage
  extends InferSchemaType<typeof messageSchema>,
    Document {
  _id: Types.ObjectId;
}

const Message = model<IMessage>("Message", messageSchema);

export default Message;
