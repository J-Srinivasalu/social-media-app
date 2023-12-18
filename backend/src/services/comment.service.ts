import Comment, { IComment } from "../models/comment.model";
import Post from "../models/post.model";
import User from "../models/user.model";
import ApiError from "../utils/error.util";

export async function createComment(
  userId: string,
  postId: string,
  comment: string
) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const newComment = Comment.create({
    userId: userId,
    postId: postId,
    comment: comment,
  });

  return newComment;
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
    .skip(offset)
    .limit(limit)
    .populate({
      path: "userId",
      select: "fullName username",
    });

  return comments;
}

export async function likeComment(commentId: string, userId: string) {
  const foundUser = await User.findById(userId);
  if (!foundUser) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const foundComment = await Comment.findById(commentId);
  if (!foundComment) {
    throw new ApiError(404, "Not Found", "Comment not found");
  }
  foundComment.likes.push(userId);
  foundComment.save();
}
