import mongoose, { InferSchemaType, Schema } from "mongoose";

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    medias: [{ type: String }],
    likes: [{ type: String }],
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
