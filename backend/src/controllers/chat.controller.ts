import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import {
  sendMessage,
  createChat,
  updateMessageStatus,
  getChatsByUser,
  getMessagesForChat,
} from "../services/chat.service";
import { AuthenticatedRequest } from "../utils/types.util";
import { emitSocketEvent } from "../socket/socket";
import { ChatEventEnum } from "../utils/constant";

const sendMessageSchema = z.object({
  content: z.string(),
  chatId: z.string(),
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

    const { content, chatId } = parsedRequest.data;
    await sendMessage(userId, content, chatId, (receiverId, newMessage) => {
      emitSocketEvent(
        req,
        receiverId,
        ChatEventEnum.NEW_CHAT_EVENT,
        newMessage
      );
    });

    const apiResponse: ApiResponse = new ApiResponse(
      "Message Sent Successfully"
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const createOrGetChatSchema = z.object({
  receiverId: z.string(),
});

export async function createOrGetChatController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = createOrGetChatSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { receiverId } = parsedRequest.data;
    const chat = await createChat(userId, receiverId, (receiverId, newChat) => {
      emitSocketEvent(req, receiverId, ChatEventEnum.NEW_CHAT_EVENT, newChat);
    });

    const apiResponse: ApiResponse = new ApiResponse(
      "Chat retrieved successfully",
      {
        chat: chat,
      }
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getChatsController(req: Request, res: Response) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const chats = await getChatsByUser(userId, offset, limit);

    const apiResponse: ApiResponse = new ApiResponse(
      "Chats fetched Successfully",
      {
        chats: chats,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

export async function getMessagesForChatController(
  req: Request,
  res: Response
) {
  try {
    const chatId = req.query.chatId as string;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    const messages = await getMessagesForChat(chatId, offset, limit);

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
