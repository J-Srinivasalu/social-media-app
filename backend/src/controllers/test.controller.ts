import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import { sendNotificationToSingleUser } from "../services/firebase.service";
import { ApiResponse } from "../models/apiResponse.model";

const notifyTestSchema = z.object({
  fcmToken: z.string(),
});

export async function notifyTestController(req: Request, res: Response) {
  try {
    const parsedRequest = notifyTestSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { fcmToken } = parsedRequest.data;

    await sendNotificationToSingleUser(
      fcmToken,
      "Test Notification",
      "This is a test notification",
      {}
    );
    res.status(200).json(new ApiResponse("Notification sent successfully"));
  } catch (error) {
    handleApiError(res, error);
  }
}
