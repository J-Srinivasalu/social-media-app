import Chat, { IChat } from "../models/chat.model";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";
import ChatMessage, { IChatMessage } from "../models/message.model";
import { MessageStatus } from "../utils/constant";
import { sendNotificationToSingleUser } from "./firebase.service";
import { IUser } from "../models/user.model";

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

  // this line doesn't work : can someone explain why?
  // it always return same person no matter who sends the message.
  // const [receiverId] = chat.participants.filter((userId) => userId != user._id);
  console.log("senderId: ", user._id);
  console.log("participents: ", JSON.stringify(chat.participants));
  const receiverId = chat.participants.find(
    (userId) => userId.toString() !== user._id.toString()
  );
  const receiver = await checkIfUserExistThenReturnUser(receiverId?.toString());
  console.log(`receiver: ${JSON.stringify(receiver)}`);

  const newMessage = await ChatMessage.create({
    chat: chat._id,
    sender: user._id,
    content: content,
    status: MessageStatus.Sent,
  });

  const popluatedMessage = await ChatMessage.findById(newMessage._id).populate({
    path: "sender",
    select: "_id fullName username profilePic isOnline updatedAt createdAt",
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
        chatId: chat._id.toString(),
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
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    })
    .populate({
      path: "lastMessage",
    })
    .populate({
      path: "lastMessage.sender", // Populate the sender field
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    });

  if (chat) {
    return [false, chat];
  }
  const newChat = await Chat.create({
    participants: [user._id, receiver._id],
  });

  const populatedChat = await Chat.findById(newChat._id).populate({
    path: "participants",
    select: "_id fullName username profilePic isOnline updatedAt createdAt",
  });

  callback(receiver._id.toString(), populatedChat!!);

  return [true, populatedChat!!];
}

export async function updateMessageStatus(
  messageId: string,
  status: string,
  callback: (senderId: string, messageId: string) => void
) {
  try {
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { $set: { status: status } },
      { new: true }
    ).populate({
      path: "sender",
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    });

    const chatId = updatedMessage?.chat;
    if (chatId) {
      callback(updatedMessage.sender.toString(), updatedMessage._id.toString());
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
  callback: () => void
) {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    console.log("updateAllMessagesInChatToRead failed: chat not found");
    return;
  }

  const messages = await ChatMessage.find({ chat: chat._id });
  messages.forEach((message) => {
    updateMessageStatus(message._id.toString(), MessageStatus.Seen, callback);
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
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    })
    .populate({
      path: "lastMessage",
    })
    .populate({
      path: "lastMessage.sender", // Populate the sender field
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
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
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    });

  return messages;
}

export async function sendVideoCallRequest(
  senderId: string,
  chatId: string,
  offer: string,
  callback: (user: IUser, receiverId: string, newMessage: IChatMessage) => void
) {
  const user = await checkIfUserExistThenReturnUser(senderId);
  let chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Not Found", "Chat not found");
  }
  console.log("senderId: ", user._id);
  console.log("participents: ", JSON.stringify(chat.participants));
  const receiverId = chat.participants.find(
    (userId) => userId.toString() !== user._id.toString()
  );
  const receiver = await checkIfUserExistThenReturnUser(receiverId?.toString());
  console.log(`receiver: ${JSON.stringify(receiver)}`);

  const newMessage = await ChatMessage.create({
    chat: chat._id,
    sender: user._id,
    content: "Video Call: ongoing",
    status: MessageStatus.Sent,
  });

  const popluatedMessage = await ChatMessage.findById(newMessage._id).populate({
    path: "sender",
    select: "_id fullName username profilePic isOnline updatedAt createdAt",
  });

  chat.lastMessage = newMessage._id;
  chat.save();

  if (receiver.fcmToken) {
    sendNotificationToSingleUser(
      receiver.fcmToken,
      user.fullName,
      newMessage.content,
      {
        action: "video_call",
        chatId: chat._id.toString(),
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic ?? "",
        offer: offer,
      }
    );
  }

  callback(user, receiver._id.toString(), popluatedMessage!!);
  return popluatedMessage;
}

export async function onVideoCallRequestRejected(
  messageId: string,
  callback: (senderId: string, messageId: string) => void
) {
  const message = await ChatMessage.findById(messageId);
  if (!message) {
    console.log("onVideoCallRequestRejected failed: message not found");
    return;
  }
  message.content = "Video call: Missed";
  message.save();
  updateMessageStatus(message._id.toString(), MessageStatus.Seen, callback);
}

export async function updateCallMessage(
  messageId: string,
  duration: string,
  callback: (senderId: string, messageId: string) => void
) {
  try {
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { $set: { content: `Video call: ${duration}` } },
      { new: true }
    ).populate({
      path: "sender",
      select: "_id fullName username profilePic isOnline updatedAt createdAt",
    });

    const chatId = updatedMessage?.chat;
    if (chatId) {
      callback(updatedMessage.sender.toString(), updatedMessage._id.toString());
    } else {
      console.log("conversation id was null");
    }
  } catch (error: any) {
    console.log(
      error?.message ?? "Something went wrong while updating message status"
    );
  }
}
