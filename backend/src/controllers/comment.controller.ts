import { Request, Response } from "express";
import z from "zod";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import { fromZodError } from "zod-validation-error";
import { ApiResponse } from "../models/apiResponse.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  createComment,
  getCommentsByPostId,
  likeComment,
} from "../services/comment.service";
import { IComment } from "../models/comment.model";

const uploadCommentSchema = z.object({
  postId: z.string(),
  content: z.string(),
});

const likeCommentSchema = z.object({
  commentId: z.string(),
});

export async function uploadCommentController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    console.log(req.body);

    const parsedRequest = uploadCommentSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { postId, content } = parsedRequest.data;

    const comment: IComment = await createComment(userId, postId, content);

    const apiResponse: ApiResponse = new ApiResponse(
      "Comment Uploaded Successfully",
      {
        comment: comment,
      }
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getCommentController(req: Request, res: Response) {
  try {
    const postId = req.query.postId as string;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!postId) {
      throw new ApiError(400, "Bad Request", "Post Id is required");
    }

    const comments: IComment[] = await getCommentsByPostId(
      postId,
      offset,
      limit
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Fetched Comments Successfully",
      {
        comments: comments,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function likeCommentController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = likeCommentSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { commentId } = parsedRequest.data;

    await likeComment(commentId, userId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Comment liked Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
