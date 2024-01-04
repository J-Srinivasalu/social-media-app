import { Server } from "socket.io";
import ApiError from "../utils/error.util";
import jwt from "jsonwebtoken";
import { checkIfUserExistThenReturnUser } from "../services/user.service";
import { CustomSocket, DecodedToken } from "../utils/types.util";
import { ChatEventEnum, MessageStatus } from "../utils/constant";
import { Request } from "express";
import {
  updateAllMessagesInChatToRead,
  updateMessageStatus,
} from "../services/chat.service";

export function initializeSocketIO(io: Server) {
  console.log("socket.io initialization started");
  return io.on("connnection", async (socket: CustomSocket) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        throw new ApiError(
          401,
          "Unauthorized",
          "Unauthorized handshake, Token is missing"
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY ?? ""
      ) as DecodedToken;

      const user = await checkIfUserExistThenReturnUser(decoded.id);

      socket.user = user;

      //creating a room so if the user is not part of any chat, he can still receive new chats for the first time.
      socket.join(user._id.toString());

      socket.emit(ChatEventEnum.CONNECTED_EVENT);
      console.log("User connected, user id: ", user._id.toString());

      socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
        console.log("User joined the chat: chat id: ", chatId);
        socket.join(chatId);
      });

      socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
      });

      socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
      });

      socket.on(ChatEventEnum.MESSAGE_DELIVERED, (messageId) => {
        updateMessageStatus(
          messageId,
          MessageStatus.Delivered,
          (senderId, updatedMessage) => {
            socket
              .in(senderId)
              .emit(ChatEventEnum.MESSAGE_DELIVERED, updatedMessage);
          }
        );
      });

      socket.on(ChatEventEnum.CHAT_MESSAGES_SEEN_EVENT, (chatId) => {
        updateAllMessagesInChatToRead(chatId, (senderId, updatedMessage) => {
          socket
            .in(senderId)
            .emit(ChatEventEnum.MESSAGE_DELIVERED, updatedMessage);
        });
      });

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("User disconnected, user id", socket.user?._id.toString());
        if (socket.user?._id) {
          socket.leave(socket.user._id.toString());
        }
      });
    } catch (error: any) {
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
    }
  });
}

export function emitSocketEvent(
  req: Request,
  roomId: string,
  event: string,
  payload: any
) {
  req.app.get("io").in(roomId).emit(event, payload);
}