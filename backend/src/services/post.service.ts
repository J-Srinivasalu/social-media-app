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

    // Query for the created post and populate the 'user' field
    const populatedPost = await Post.findById(post._id).populate({
      path: "user",
      select: "_id fullName username profilePic",
    });

    return populatedPost!!;
  } catch (error) {
    console.log(error);
    throw new ApiError();
  }
}

export async function getPosts(
  offset: number,
  limit: number
): Promise<IPost[]> {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "user",
        select: "_id fullName username profilePic",
      });

    return posts;
  } catch (error) {
    console.log(error);
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
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate({
        path: "user",
        select: "_id fullName username profilePic",
      });

    return posts;
  } catch (error) {
    console.log(error);
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
    console.log(error);
    throw new ApiError();
  }
}
