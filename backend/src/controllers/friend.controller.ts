import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { AuthenticatedRequest } from "../utils/types.util";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  sendUnfriendRequest,
} from "../services/friend.service";

const sendFriendRequestSchema = z.object({
  receiverId: z.string(),
});

export async function sendFriendRequestController(req: Request, res: Response) {
  try {
    const parsedRequest = sendFriendRequestSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { receiverId } = parsedRequest.data;

    await sendFriendRequest(userId, receiverId);
    const apiResponse: ApiResponse = new ApiResponse(
      "Friend request sent Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function unfriendRequestController(req: Request, res: Response) {
  try {
    const parsedRequest = sendFriendRequestSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { receiverId } = parsedRequest.data;

    await sendUnfriendRequest(userId, receiverId);
    const apiResponse: ApiResponse = new ApiResponse(
      "Friend removed Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const responsedToFriendRequestSchema = z.object({
  senderId: z.string(),
});

export async function AcceptFriendRequestController(
  req: Request,
  res: Response
) {
  try {
    const parsedRequest = responsedToFriendRequestSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { senderId } = parsedRequest.data;

    await acceptFriendRequest(userId, senderId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Friend request accepted Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function rejectFriendRequestController(
  req: Request,
  res: Response
) {
  try {
    const parsedRequest = responsedToFriendRequestSchema.safeParse(req.body);

    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const userId = (req as AuthenticatedRequest).user.id;

    const { senderId } = parsedRequest.data;

    await rejectFriendRequest(userId, senderId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Friend request rejected Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
