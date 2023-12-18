import mongoose, { InferSchemaType, Schema } from "mongoose";

const postSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    image: { type: String },
    likes: [{ type: String }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

export interface IPost extends InferSchemaType<typeof postSchema>, Document {
  _id: mongoose.Types.ObjectId;
}

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
