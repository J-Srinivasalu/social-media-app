export enum MessageStatus {
  Sent = "sent",
  Delivered = "delivered",
  Seen = "seen",
}

export const ChatEventEnum = Object.freeze({
  // ? once user is ready to go
  CONNECTED_EVENT: "connected",
  // ? when user gets disconnected
  DISCONNECT_EVENT: "disconnect",
  // ? when user joins a socket room
  JOIN_CHAT_EVENT: "joinChat",
  // ? when new message is received
  MESSAGE_RECEIVED_EVENT: "messageReceived",
  // ? when there is new one on one chat
  NEW_CHAT_EVENT: "newChat",
  // ? when there is an error in socket
  SOCKET_ERROR_EVENT: "socketError",
  // ? when participant stops typing
  STOP_TYPING_EVENT: "stopTyping",
  // ? when participant starts typing
  TYPING_EVENT: "typing",
  // ? when receiver open a chat all messages sent by other participant in that chat are marked as seen
  CHAT_MESSAGES_SEEN_EVENT: "messagesSeen",
  // ? when user receives message notification
  MESSAGE_DELIVERED: "messageDelivered",
  // ? when user goes offline
  USER_OFFLINE: "userOffline",
  // ? when user comes online
  USER_ONLINE: "userOnline",

  VIDEO_CALL_OFFER_EVENT: "videoCallOffer",
  VIDEO_CALL_ACCEPT_EVENT: "videoCallAccept",
  VIDEO_CALL_REJECT_EVENT: "videoCallReject",
  VIDEO_CALL_ADD_CONDIDATE_EVENT: "videoCallAddCondidate",
  VIDEO_CALL_ENDED_EVENT: "videoCallEnded",
});

export const AvailableChatEvents = Object.values(ChatEventEnum);
