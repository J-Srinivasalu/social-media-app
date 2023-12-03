import { Request, Response } from "express";
import z from "zod";
import ApiError from "../utils/error.util";
import handleApiError from "../utils/apiErrorHandler";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { fromZodError } from "zod-validation-error";
import { createPost, getPosts } from "../services/post.service";
import { ApiResponse } from "../models/apiResponse.model";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const postSchema = z.object({
  content: z.string(),
});

export async function uploadPostController(req: Request, res: Response) {
  try {
    console.log("in upload controller");
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = postSchema.safeParse(req.body);
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
    const posts = await getPosts();

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
