import mongoose, { InferSchemaType, Schema } from "mongoose";

const postSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export type IPost = InferSchemaType<typeof postSchema>;

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
