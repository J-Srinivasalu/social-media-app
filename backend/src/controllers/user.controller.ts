import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { AuthenticatedRequest } from "../utils/types.util";
import {
  getPublicProfile,
  getUser,
  updateUser,
  setFcmToken,
} from "../services/user.service";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import { PublicProfile } from "../models/publicProfile.model";
import { uploadOnCloudinary } from "../services/cloudinary.service";
import { IUser } from "../models/user.model";

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
    let profilePic;
    if (localFilePath) {
      profilePic = await uploadOnCloudinary(localFilePath);
    }

    const user: IUser = await updateUser(userId, fullName, profilePic);

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

const setFcmTokenSchema = z.object({
  fcmToken: z.string(),
});

export async function setFcmTokenController(req: Request, res: Response) {
  try {
    const parsedRequest = setFcmTokenSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { fcmToken } = parsedRequest.data;

    await setFcmToken(userId, fcmToken);

    const apiResponse: ApiResponse = new ApiResponse(
      "FCM Token added/updated Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
