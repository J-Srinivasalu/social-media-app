import mongoose, { Document, InferSchemaType, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: Schema.Types.ObjectId, ref: "Post" },
    content: { type: String },
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
