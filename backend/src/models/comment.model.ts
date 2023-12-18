import mongoose, { Document, InferSchemaType, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IPost } from "./post.model";

const commentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    comment: { type: String, required: true },
    likes: [{ type: String }],
  },
  { timestamps: true }
);

export interface IComment
  extends InferSchemaType<typeof commentSchema>,
    Document {
  _id: mongoose.Types.ObjectId;
}

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
