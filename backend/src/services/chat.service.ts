import Chat, { IChat } from "../models/chat.model";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";
import ChatMessage, { IChatMessage } from "../models/message.model";
import { MessageStatus } from "../utils/constant";
import { sendNotificationToSingleUser } from "./firebase.service";

export async function sendMessage(
  senderId: string,
  content: string,
  chatId: string,
  callback: (receiverId: string, newMessage: IChatMessage) => void
) {
  const user = await checkIfUserExistThenReturnUser(senderId);
  let chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Not Found", "Chat not found");
  }

  const [receiverId] = chat.participants.filter((userId) => userId != user._id);
  const receiver = await checkIfUserExistThenReturnUser(receiverId.toString());

  const newMessage = await ChatMessage.create({
    chat: chat._id,
    sender: user._id,
    content: content,
    status: MessageStatus.Sent,
  });

  const popluatedMessage = await ChatMessage.findById(newMessage._id).populate({
    path: "sender",
    select: "_id fullName username profilePic",
  });

  chat.lastMessage = newMessage._id;
  chat.save();

  if (receiver.fcmToken) {
    sendNotificationToSingleUser(
      receiver.fcmToken,
      user.fullName,
      newMessage.content,
      {
        action: "message",
        conversationId: chat._id.toString(),
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic ?? "",
        content: newMessage.content,
      }
    );
  }

  callback(receiver._id.toString(), popluatedMessage!!);
  return popluatedMessage;
}

export async function createChat(
  senderId: string,
  receiverId: string,
  callback: (receiverId: string, newChat: IChat) => void
): Promise<[boolean, IChat]> {
  const user = await checkIfUserExistThenReturnUser(senderId);
  const receiver = await checkIfUserExistThenReturnUser(receiverId);

  if (receiver._id.toString() == user._id.toString()) {
    throw new ApiError(
      400,
      "Bad Request",
      "You cannot chat with yourself (for now!)"
    );
  }
  const chat = await Chat.findOne({
    participants: { $all: [user._id, receiver._id] },
  })
    .populate({
      path: "participants",
      select: "_id fullName username profilePic",
    })
    .populate({
      path: "lastMessage",
      select: "_id sender content status",
    });

  if (chat) {
    return [false, chat];
  }
  const newChat = await Chat.create({
    participants: [user._id, receiver._id],
  });

  const populatedChat = await Chat.findById(newChat._id).populate({
    path: "participants",
    select: "_id fullName username profilePic",
  });

  callback(receiver._id.toString(), populatedChat!!);

  return [true, populatedChat!!];
}

export async function updateMessageStatus(
  messageId: string,
  status: string,
  callback: (senderId: string, updateMessage: IChatMessage) => void
) {
  try {
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { $set: { status: status } },
      { new: true }
    ).populate({
      path: "sender",
      select: "_id fullName username profilePic",
    });

    const chatId = updatedMessage?.chat;
    if (chatId) {
      callback(updatedMessage.sender.toString(), updatedMessage);
    } else {
      console.log("conversation id was null");
    }
  } catch (error: any) {
    console.log(
      error?.message ?? "Something went wrong while updating message status"
    );
  }
}

export async function updateAllMessagesInChatToRead(
  chatId: string,
  callback: (senderId: string, updateMessage: IChatMessage) => void
) {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    console.log("updateAllMessagesInChatToRead failed: chat not found");
    return;
  }

  const messages = await ChatMessage.find({ chatId: chat._id });
  messages.forEach((message) => {
    updateMessageStatus(message._id.toString(), MessageStatus.Read, callback);
  });
}

export async function getChatsByUser(
  userId: string,
  offset: number,
  limit: number
) {
  const chats = await Chat.find({ participants: userId })
    .sort({ updateAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "participants",
      select: "_id fullName username profilePic",
    })
    .populate({
      path: "lastMessage",
      select: "_id sender content status",
    });

  return chats;
}

export async function getMessagesForChat(
  chatId: string,
  offset: number,
  limit: number
) {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new ApiError(404, "Not Found", "Chat not found");
  }

  const messages = await ChatMessage.find({ chat: chat._id })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "sender",
      select: "_id fullName username profilePic",
    });

  return messages;
}
