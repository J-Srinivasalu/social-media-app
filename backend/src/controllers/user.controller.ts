import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  getPublicProfile,
  getUser,
  updateUser,
} from "../services/user.service";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import { PublicProfile } from "../models/publicProfile.model";
import { uploadOnCloudinary } from "../services/cloudinary.service";

export async function getUserController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const user = await getUser(userId);
    const apiResponse: ApiResponse = new ApiResponse(
      "Fetched User Details Successfully",
      {
        user: user,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getPublicProfileController(req: Request, res: Response) {
  try {
    const userId = req.params.userId;

    const publicProfile: PublicProfile = await getPublicProfile(userId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Fetched User Details Successfully",
      {
        user: publicProfile,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const updateUserSchema = z.object({
  fullName: z.string(),
});

export async function updateUserController(req: Request, res: Response) {
  try {
    const parsedRequest = updateUserSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { fullName } = parsedRequest.data;

    const localFilePath = req.file?.path;
    let profilePicUrl;
    if (localFilePath) {
      profilePicUrl = await uploadOnCloudinary(localFilePath);
    }

    const user: PublicProfile = await updateUser(
      userId,
      fullName,
      profilePicUrl
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Updated User Details Successfully",
      {
        user: user,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
