import { Request, Response } from "express";
import z, { date } from "zod";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { fromZodError } from "zod-validation-error";
import { createPost, getPosts, likePost } from "../services/post.service";
import { ApiResponse } from "../models/apiResponse.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { IPost } from "../models/post.model";

const uploadPostSchema = z.object({
  content: z.string(),
});

const likePostSchema = z.object({
  postId: z.string(),
});

export async function uploadPostController(req: Request, res: Response) {
  try {
    console.log("in upload controller");
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = uploadPostSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { content } = parsedRequest.data;

    const localFilePath = req.file?.path;
    let imageUrl;
    if (localFilePath) {
      imageUrl = await uploadOnCloudinary(localFilePath);
    }

    const post = await createPost(userId, content, imageUrl);

    const apiResponse: ApiResponse = new ApiResponse(
      "Post Uploaded Successfully",
      {
        post: post,
      }
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getPostController(req: Request, res: Response) {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const posts: IPost[] = await getPosts(offset, limit);

    const apiResponse: ApiResponse = new ApiResponse(
      "Fetched Posts Successfully",
      {
        posts: posts,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function likePostController(req: Request, res: Response) {
  try {
    console.log("in upload controller");
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = likePostSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { postId } = parsedRequest.data;

    await likePost(postId, userId);

    const apiResponse: ApiResponse = new ApiResponse("Post liked Successfully");
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
