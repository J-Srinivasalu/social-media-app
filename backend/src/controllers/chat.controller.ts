import { Request, Response } from "express";
import handleApiError from "../utils/apiErrorHandler";
import { ApiResponse } from "../models/apiResponse.model";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import ApiError from "../utils/error.util";
import {
  sendMessage,
  createChat,
  getChatsByUser,
  getMessagesForChat,
  sendVideoCallRequest,
  onVideoCallRequestRejected,
  fetchMessage,
} from "../services/chat.service";
import { AuthenticatedRequest } from "../utils/types.util";
import { emitSocketEvent } from "../socket/socket";
import { ChatEventEnum } from "../utils/constant";
import { IChat } from "../models/chat.model";

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
    const newMessage = await sendMessage(
      userId,
      content,
      chatId,
      (receiverId, newMessage) => {
        console.log(
          `${ChatEventEnum.NEW_CHAT_EVENT} ${receiverId} - ${JSON.stringify(
            newMessage
          )}`
        );
        emitSocketEvent(
          req,
          receiverId,
          ChatEventEnum.MESSAGE_RECEIVED_EVENT,
          newMessage
        );
      }
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Message Sent Successfully",
      {
        message: newMessage,
      }
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
    const [isNew, chat]: [boolean, IChat] = await createChat(
      userId,
      receiverId,
      (receiverId, newChat) => {
        console.log(
          `${ChatEventEnum.NEW_CHAT_EVENT} ${receiverId} - ${JSON.stringify(
            newChat
          )}`
        );
        emitSocketEvent(req, receiverId, ChatEventEnum.NEW_CHAT_EVENT, newChat);
      }
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Chat retrieved successfully",
      {
        chat: chat,
      }
    );
    res.status(isNew ? 201 : 200).json(apiResponse);
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

export async function getMessageController(req: Request, res: Response) {
  try {
    const messageId = req.params.id;

    const message = await fetchMessage(messageId);

    const apiResponse: ApiResponse = new ApiResponse(
      "Message fetched Successfully",
      {
        message: message,
      }
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const callRequestSchema = z.object({
  chatId: z.string(),
  offer: z.string(),
});

export async function sendVideoCallRequestController(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const parsedRequest = callRequestSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { chatId, offer } = parsedRequest.data;
    const newMessage = await sendVideoCallRequest(
      userId,
      chatId,
      offer,
      (user, receiverId, newMessage) => {
        console.log(`${ChatEventEnum.VIDEO_CALL_OFFER_EVENT} ${receiverId}`);
        emitSocketEvent(req, receiverId, ChatEventEnum.VIDEO_CALL_OFFER_EVENT, {
          user,
          chatId,
          offer,
          message: newMessage,
        });
      }
    );

    const apiResponse: ApiResponse = new ApiResponse(
      "Sent video call request successfully",
      {
        message: newMessage,
      }
    );
    res.status(201).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}

const rejectCallRequestSchema = z.object({
  messageId: z.string(),
});

export async function rejectVideoCallRequestController(
  req: Request,
  res: Response
) {
  try {
    const parsedRequest = rejectCallRequestSchema.safeParse(req.body);
    if (!parsedRequest.success) {
      const errorMessage = fromZodError(parsedRequest.error).message.replace(
        /"/g,
        "'"
      );
      throw new ApiError(400, "Bad Request", errorMessage);
    }

    const { messageId } = parsedRequest.data;
    await onVideoCallRequestRejected(messageId, (senderId, messageId) => {
      console.log(
        `${ChatEventEnum.VIDEO_CALL_REJECT_EVENT} ${senderId} - ${messageId}`
      );
      emitSocketEvent(
        req,
        senderId,
        ChatEventEnum.VIDEO_CALL_REJECT_EVENT,
        messageId
      );
    });

    const apiResponse: ApiResponse = new ApiResponse(
      "video call request rejected"
    );
    res.status(200).json(apiResponse);
  } catch (error) {
    handleApiError(res, error);
  }
}
