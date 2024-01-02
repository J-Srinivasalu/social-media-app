import { Request, Response } from "express";
import z from "zod";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { fromZodError } from "zod-validation-error";
import {
  createPost,
  getPosts,
  getPostsByUserId,
  likePost,
} from "../services/post.service";
import { ApiResponse } from "../models/apiResponse.model";
import { IPost } from "../models/post.model";
import { AuthenticatedRequest } from "../utils/types.util";

const uploadPostSchema = z.object({
  content: z.string(),
});

const likePostSchema = z.object({
  postId: z.string(),
});

// upload post
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

    const filePromises: string[] = (req.files as any).map(
      async (file: Express.Multer.File) => {
        const localFilePath = file.path;
        let imageUrl;

        if (localFilePath) {
          imageUrl = await uploadOnCloudinary(localFilePath);
        }

        return imageUrl;
      }
    );

    const uploadedImageUrls = await Promise.all(filePromises);

    const post = await createPost(userId, content, uploadedImageUrls);

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

// get posts
export async function getPostsController(req: Request, res: Response) {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;
    const userId = req.query.userId as string;
    const posts: IPost[] =
      userId != null && userId.length > 0
        ? await getPostsByUserId(userId, offset, limit)
        : await getPosts(offset, limit);

    const apiResponse: ApiResponse = new ApiResponse(
      `Fetched posts successfully`,
      {
        posts: posts,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

//like post
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
