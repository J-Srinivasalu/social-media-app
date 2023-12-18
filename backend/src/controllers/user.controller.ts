import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { getPublicProfile, getUser } from "../services/user.service";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import { PublicProfile } from "../models/publicProfile.model";

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

const getPublicProfileSchema = z.object({
  username: z.string(),
});

export async function getPublicProfileController(req: Request, res: Response) {
  try {
    const parsedRequest = getPublicProfileSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { username } = parsedRequest.data;

    const publicProfile: PublicProfile = await getPublicProfile(username);

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
