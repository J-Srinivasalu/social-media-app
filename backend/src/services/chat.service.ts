import { Types } from "mongoose";
import { io } from "..";
import Conversation from "../models/conversation.model";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";
import Message, { IMessage } from "../models/message.model";
import { MessageStatus } from "../utils/constant";
import { sendNotificationToSingleUser } from "./firebase.service";

export async function sendMessage(
  senderId: string,
  message: string,
  conversationId?: string
) {
  const user = await checkIfUserExistThenReturnUser(senderId);
  let conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new ApiError(404, "Not Found", "Conversation not found");
  }

  const [receiverId] = conversation.participants.filter(
    (userId) => userId != user._id
  );
  const receiver = await checkIfUserExistThenReturnUser(receiverId.toString());

  const newMessage = await Message.create({
    conversationId: conversation._id,
    sender: user._id,
    content: message,
    status: MessageStatus.Sent,
  });

  newMessage.save();

  if (receiver.fcmToken) {
    sendNotificationToSingleUser(
      receiver.fcmToken,
      user.fullName,
      newMessage.content,
      {
        action: "message",
        conversationId: conversation._id.toString(),
        id: user._id.toString(),
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic ?? "",
        content: newMessage.content,
      }
    );
  }

  io.to(conversation._id.toString()).emit("new_message", newMessage);
}

export async function createConversation(
  senderId: string,
  receiverId: string,
  message: string
) {
  const user = await checkIfUserExistThenReturnUser(senderId);
  const receiver = await checkIfUserExistThenReturnUser(receiverId);
  let conversation = await Conversation.findOne({
    participants: { $all: [user._id, receiver._id] },
  });
  if (conversation) {
    throw new ApiError(
      400,
      "Bad Request",
      "Conversation Already exist, Please send via existing conversation."
    );
  }
  conversation = await Conversation.create({
    participants: [user._id, receiver._id],
  });

  await sendMessage(user._id.toString(), message, conversation._id.toString());
}

export async function updateMessageStatus(messageId: string, status: string) {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { $set: { status: status } },
    { new: true }
  );
  const conversationId = updatedMessage?.conversationId;
  if (conversationId) {
    io.to(conversationId.toString()).emit("messageStatusUpdated", {
      messageId,
      status,
    });
  } else {
    console.log("conversation id was null");
  }
}

export async function getConversationsByUser(
  userId: string,
  offset: number,
  limit: number
) {
  const conversations = await Conversation.find({ participants: userId })
    .sort({ updateAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate({
      path: "perticipants",
      select: "_id fullName username profilePic",
    });

  const messagesByConversation = await Promise.all(
    conversations.map(async (conversation) => {
      const conversationId = conversation._id.toString();
      const recentMessages = await getMessagesForConversation(
        conversationId,
        0,
        20
      );
      return { conversation, recentMessages };
    })
  );

  return messagesByConversation;
}

export async function getMessagesForConversation(
  conversationId: string,
  offset: number,
  limit: number
): Promise<IMessage[]> {
  const messages = await Message.find({ conversationId: conversationId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return messages;
}
