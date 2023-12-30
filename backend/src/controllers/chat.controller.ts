import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import handleApiError from "../utils/apiErrorHandler";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import {
  sendMessage,
  createConversation,
  updateMessageStatus,
  getConversationsByUser,
  getMessagesForConversation,
} from "../services/chat.service";

const sendMessageSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
});

export async function sendMessageController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = sendMessageSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { message, conversationId } = parsedRequest.data;
    await sendMessage(userId, message, conversationId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Message Sent Successfully"
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const startConversationSchema = z.object({
  receiverId: z.string(),
  message: z.string(),
});

export async function startConversationController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = startConversationSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { receiverId, message } = parsedRequest.data;
    await createConversation(userId, receiverId, message);

    const apiResponse: ApiResponse = new ApiResponse(
      "Message Sent Successfully"
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const updateStatusSchema = z.object({
  messageId: z.string(),
  status: z.string(),
});

export async function updateStatusController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = updateStatusSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { messageId, status } = parsedRequest.data;
    await updateMessageStatus(messageId, status);

    const apiResponse: ApiResponse = new ApiResponse(
      "Message status updated Successfully"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getConversationsController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const conversationsWithRecentMessages = await getConversationsByUser(
      userId,
      offset,
      limit
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Conversations fetched Successfully",
      {
        conversations: conversationsWithRecentMessages,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getMessagesForConversationController(
  req: Request,
  res: Response
) {
  try {
    const conversationId = req.query.conversationId as string;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const messages = await getMessagesForConversation(
      conversationId,
      offset,
      limit
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Messages fetched Successfully",
      {
        messages: messages,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
