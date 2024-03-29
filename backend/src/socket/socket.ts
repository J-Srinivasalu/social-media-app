import { Server } from "socket.io";
import ApiError from "../utils/error.util";
import jwt from "jsonwebtoken";
import { checkIfUserExistThenReturnUser } from "../services/user.service";
import { CustomSocket, DecodedToken } from "../utils/types.util";
import { ChatEventEnum, MessageStatus } from "../utils/constant";
import { Request } from "express";
import {
  updateAllMessagesInChatToRead,
  callEnded,
  updateMessageStatus,
  missedCall,
} from "../services/chat.service";
import config from "../config/config";

export function initializeSocketIO(io: Server) {
  console.log("socket.io initialization started");
  return io.on("connection", async (socket: CustomSocket) => {
    try {
      console.log("connected");
      const token = socket.handshake.auth.token;
      console.log("handshake token: ", token);
      if (!token) {
        throw new ApiError(
          401,
          "Unauthorized",
          "Unauthorized handshake, Token is missing"
        );
      }

      const decoded = jwt.verify(
        token,
        config.accessTokenSecretKey ?? ""
      ) as DecodedToken;

      console.log(decoded);

      const user = await checkIfUserExistThenReturnUser(decoded.id);

      socket.user = user;

      //creating a room so if the user is not part of any chat, he can still receive new chats for the first time.
      socket.join(user._id.toString());

      user.isOnline = true;
      user.save();
      socket.emit(ChatEventEnum.CONNECTED_EVENT, user._id.toString());
      console.log("user online", user._id.toString());
      socket.broadcast.emit(ChatEventEnum.USER_ONLINE, user._id.toString());
      socket.onAnyOutgoing((event) => {
        console.log("onAnyOutgoing: Event sent: ", event);
      });
      socket.onAny((event) => {
        console.log("onAny: Event sent: ", event);
      });
      io.engine.on("connection_error", (err) => {
        console.log("connection_err_s");
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
        console.log("connection_err_e");
      });
      console.log("User connected, user id: ", user._id.toString());

      socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
        console.log("User joined the chat: chat id: ", chatId);
        socket.join(chatId);
      });

      socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
        console.log(`${ChatEventEnum.TYPING_EVENT} ${chatId}`);
        socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId);
      });

      socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
        console.log(`${ChatEventEnum.STOP_TYPING_EVENT} ${chatId}`);
        socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId);
      });

      socket.on(ChatEventEnum.MESSAGE_DELIVERED, (messageId) => {
        console.log(`${ChatEventEnum.MESSAGE_DELIVERED} ${messageId}`);
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
        console.log(`${ChatEventEnum.CHAT_MESSAGES_SEEN_EVENT} ${chatId}`);
        updateAllMessagesInChatToRead(chatId, () => {
          console.log(
            `EMIT ${ChatEventEnum.CHAT_MESSAGES_SEEN_EVENT} ${chatId}`
          );
        });
        socket.in(chatId).emit(ChatEventEnum.CHAT_MESSAGES_SEEN_EVENT, chatId);
      });

      socket.on(
        ChatEventEnum.VIDEO_CALL_ACCEPT_EVENT,
        ({ senderId, answer }) => {
          console.log(`${ChatEventEnum.VIDEO_CALL_ACCEPT_EVENT} ${answer}`);
          socket
            .in(senderId)
            .emit(ChatEventEnum.VIDEO_CALL_ACCEPT_EVENT, answer);
        }
      );

      socket.on(
        ChatEventEnum.VIDEO_CALL_ADD_CONDIDATE_EVENT,
        ({ receiverId, chatId, candidate }) => {
          console.log(
            `${ChatEventEnum.VIDEO_CALL_ADD_CONDIDATE_EVENT} ${chatId} ${candidate}`
          );
          socket
            .in(chatId)
            .in(receiverId)
            .emit(ChatEventEnum.VIDEO_CALL_ADD_CONDIDATE_EVENT, candidate);
        }
      );

      socket.on(
        ChatEventEnum.VIDEO_CALL_ENDED_EVENT,
        ({ chatId, messageId, duration, attended }) => {
          console.log(
            `${ChatEventEnum.VIDEO_CALL_ENDED_EVENT} ${chatId} ${messageId} ${duration} ${attended}`
          );
          if (!attended) {
            console.log(`${ChatEventEnum.VIDEO_CALL_ENDED_EVENT} missed`);
            missedCall(messageId, (updatedMessage) => {
              socket
                .in(updatedMessage.receiver._id.toString())
                .emit(ChatEventEnum.VIDEO_CALL_MISSED_EVENT, {
                  message: updatedMessage,
                });

              socket
                .in(updatedMessage.sender._id.toString())
                .emit(ChatEventEnum.VIDEO_CALL_MISSED_EVENT, {
                  message: updatedMessage,
                });
            });
          } else {
            callEnded(messageId, duration, (updatedMessage) => {
              socket
                .in(updatedMessage.sender._id.toString())
                .in(updatedMessage.receiver._id.toString())
                .in(chatId)
                .emit(ChatEventEnum.VIDEO_CALL_ENDED_EVENT, {
                  message: updatedMessage,
                });
            });
          }
        }
      );

      socket.on(ChatEventEnum.VIDEO_CALL_MISSED_EVENT, ({ messageId }) => {
        console.log(`${ChatEventEnum.VIDEO_CALL_ENDED_EVENT} ${messageId} `);
        missedCall(messageId, (updatedMessage) => {
          socket
            .in(updatedMessage.receiver._id.toString())
            .emit(ChatEventEnum.VIDEO_CALL_MISSED_EVENT, {
              message: updatedMessage,
            });
        });
      });

      socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
        console.log("User disconnected, user id", socket.user?._id.toString());
        user.isOnline = false;
        user.save();
        console.log("user offline", user._id.toString());
        socket.broadcast.emit(ChatEventEnum.USER_OFFLINE, user._id.toString());
        if (socket.user?._id) {
          socket.leave(socket.user._id.toString());
        }
      });
    } catch (error: any) {
      console.log(`Error occured`);
      console.log(error);
      socket.emit(
        ChatEventEnum.SOCKET_ERROR_EVENT,
        error?.message || "Something went wrong while connecting to the socket."
      );
      console.log("user offline", socket.user?._id.toString());
      socket.broadcast.emit(
        ChatEventEnum.USER_OFFLINE,
        socket.user?._id.toString()
      );
      if (socket.user?._id) {
        socket.leave(socket.user._id.toString());
      }
    }
  });
}

export function emitSocketEvent(
  req: Request,
  roomId: string,
  event: string,
  payload: any
) {
  console.log(
    `emit socket event ${roomId} ${event} ${JSON.stringify(payload)}`
  );
  req.app.get("io").in(roomId).emit(event, payload);
}
