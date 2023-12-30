import { Document, Schema, model, InferSchemaType, Types } from "mongoose";
import { MessageStatus } from "../utils/constant";

const conversationSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ updatedAt: -1 });

export interface IConversation
  extends InferSchemaType<typeof conversationSchema>,
    Document {
  _id: Types.ObjectId;
}

const Conversation = model<IConversation>("Conversation", conversationSchema);

export default Conversation;
