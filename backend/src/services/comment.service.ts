import Comment, { IComment } from "../models/comment.model";
import Post from "../models/post.model";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";

export async function createComment(
  userId: string,
  postId: string,
  comment: string
): Promise<IComment> {
  const user = await checkIfUserExistThenReturnUser(userId);
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Not Found", "Post not found");
  }

  const newComment = await Comment.create({
    user: user._id,
    postId: postId,
    content: comment,
  });

  const populatedComment = await Comment.findById(newComment._id)
    .populate({ path: "user", select: "_id fullName username profilePicUrl" })
    .exec();

  //update comment count in post
  post.comments = post.comments == null ? 0 : post.comments + 1;
  post.save();

  return populatedComment!!;
}

export async function getCommentsByPostId(
  postId: string,
  offset: number,
  limit: number
): Promise<IComment[]> {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Not Found", "Post not found");
  }

  const comments = await Comment.find({ postId: post._id })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id fullName username profilePicUrl",
    });

  return comments;
}

export async function likeComment(commentId: string, userId: string) {
  await checkIfUserExistThenReturnUser(userId);

  const foundComment = await Comment.findById(commentId);
  if (!foundComment) {
    throw new ApiError(404, "Not Found", "Comment not found");
  }
  foundComment.likes.push(userId);
  foundComment.save();
}
