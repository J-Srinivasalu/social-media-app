import Post, { IPost } from "../models/post.model";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";

export async function createPost(
  userId: string,
  content: string,
  medias?: string[]
): Promise<IPost> {
  const foundUser = await checkIfUserExistThenReturnUser(userId);

  try {
    const post = await Post.create({
      user: foundUser._id,
      content: content,
      medias: medias,
    });

    post.populate({
      path: "user",
      select: "userId fullName username",
    });

    return post;
  } catch (error) {
    throw new ApiError();
  }
}

export async function getPosts(
  offset: number,
  limit: number
): Promise<IPost[]> {
  try {
    const posts = await Post.find().skip(offset).limit(limit).populate({
      path: "user",
      select: "userId fullName username",
    });
    return posts;
  } catch (error) {
    throw new ApiError();
  }
}

export async function getPostsByUserId(
  userId: string,
  offset: number,
  limit: number
): Promise<IPost[]> {
  try {
    const foundUser = await checkIfUserExistThenReturnUser(userId);

    const posts = await Post.find({ user: foundUser._id })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "user",
        select: "userId fullName username",
      });

    return posts;
  } catch (error) {
    throw new ApiError();
  }
}

export async function likePost(postId: string, userId: string) {
  await checkIfUserExistThenReturnUser(userId);

  const foundPost = await Post.findById(postId);
  if (!foundPost) {
    throw new ApiError(404, "Not Found", "Post not found");
  }
  try {
    foundPost.likes.push(userId);
    foundPost.save();
  } catch (error) {
    throw new ApiError();
  }
}
