import Post, { IPost } from "../models/post.model";
import User from "../models/user.model";
import ApiError from "../utils/error.util";

export async function createPost(
  userId: string,
  content: string,
  image?: string
): Promise<IPost> {
  const foundUser = await User.findById(userId);
  if (!foundUser) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  try {
    const post = await Post.create({
      user_id: userId,
      content: content,
      image: image,
    });
    return post;
  } catch (error) {
    throw new ApiError();
  }
}

export async function getPosts(): Promise<IPost[]> {
  try {
    const posts = await Post.find();
    return posts;
  } catch (error) {
    throw new ApiError();
  }
}
