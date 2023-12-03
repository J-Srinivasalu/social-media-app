import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IPost } from "./post.model";

export interface IComment extends Document {
  user_id: IUser["_id"];
  post_id: IPost["_id"];
  comment: string;
  from: string;
  replies: ISubComment;
  likes: string[];
  comments: string[];
}

export interface ISubComment extends Document {
  rid: IComment["_id"];
  user_id: IUser["_id"];
  from: string;
  replay_at: string;
  comment: string;
  created_at: Date;
  updated_at: Date;
  likes: string[];
}

const commentSchema = new Schema<IComment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    post_id: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: String, required: true },
    from: { type: String, required: true },
    replies: [
      {
        rid: { type: mongoose.Schema.Types.ObjectId },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        from: { type: String },
        reply_at: { type: String },
        comment: { type: String },
        created_at: { type: Date, default: Date.now() },
        updated_at: { type: Date, default: Date.now() },
        likes: [{ type: String }],
      },
    ],
    likes: [{ type: String }],
  },
  { timestamps: true }
);

const Post = mongoose.model<IComment>("Comment", commentSchema);

export default Post;
