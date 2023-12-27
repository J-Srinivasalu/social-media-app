import ApiError from "../utils/error.util";
import { sendNotificationToSingleUser } from "./firebase.service";
import { checkIfUserExistThenReturnUser } from "./user.service";

/*
param userId : user id of signin user
param recieverId : user id of the user to whom the friend request is sent
*/
export async function sendFriendRequest(userId: string, recieverId: string) {
  const user = await checkIfUserExistThenReturnUser(userId);
  const reciever = await checkIfUserExistThenReturnUser(recieverId);

  const existingRequest = user.friendRequestSent.find(
    (request) => request.user?.toString() === reciever._id.toString()
  );

  if (existingRequest) {
    throw new ApiError(400, "Bad Request", "Friend request already sent.");
  }

  reciever.friendRequestReceived.push({
    user: user._id,
    status: "pending",
  });
  await reciever.save();

  user.friendRequestSent.push({
    user: reciever._id,
    status: "pending",
  });
  await user.save();
  if (reciever.fcmToken) {
    sendNotificationToSingleUser(
      reciever.fcmToken,
      "Friend request",
      `${user.fullName} wants to be your friend!`
    );
  } else {
    console.log("Notification not sent, as reciever doesn't have fcmToken");
  }
}

/*
param userId : user id of signin user
param recieverId : user id of the user to unfriend
*/
export async function sendUnfriendRequest(userId: string, recieverId: string) {
  const user = await checkIfUserExistThenReturnUser(userId);
  const reciever = await checkIfUserExistThenReturnUser(recieverId);

  user.friends = user.friends.filter(
    (id) => id.toString() !== reciever._id.toString()
  );

  reciever.friends = reciever.friends.filter(
    (id) => id.toString() !== user._id.toString()
  );

  await user.save();
  await reciever.save();
  if (reciever.fcmToken) {
    sendNotificationToSingleUser(
      reciever.fcmToken,
      "Unfriend request",
      `${user.fullName} unfriended you`
    );
  } else {
    console.log("Notification not sent, as reciever doesn't have fcmToken");
  }
}

/*
  param userId: user id of the signed-in user
  param senderId: user id of the sender whose friend request is being accepted
  */
export async function acceptFriendRequest(userId: string, senderId: string) {
  const user = await checkIfUserExistThenReturnUser(userId);
  const sender = await checkIfUserExistThenReturnUser(senderId);

  const friendRequest = user.friendRequestReceived.find(
    (request) => request.user?.toString() == sender.id
  );

  if (!friendRequest) {
    throw new ApiError(404, "Not Found", "Friend request not found.");
  } else if (friendRequest.status === "accepted") {
    throw new ApiError(400, "Bad Request", "Friend request already accepted");
  }

  const sendersFriendRequest = sender.friendRequestSent.find(
    (request) => request.user?.toString() == user.id
  );

  if (!sendersFriendRequest) {
    throw new ApiError(404, "Not Found", "Friend request not found.");
  }

  // Delete the friend request from user's friendRequestReceived array
  user.friendRequestReceived = user.friendRequestReceived.filter(
    (request) => request.user?.toString() !== sender._id.toString()
  );

  sendersFriendRequest.status = "accepted";

  user.friends.push(sender._id);
  sender.friends.push(user._id);

  await user.save();
  await sender.save();
  if (sender.fcmToken) {
    sendNotificationToSingleUser(
      sender.fcmToken,
      "Friend request",
      `$You and ${user.fullName} are friend now!`
    );
  } else {
    console.log("Notification not sent, as reciever doesn't have fcmToken");
  }
}

/*
  param userId: user id of the signed-in user
  param senderId: user id of the sender whose friend request is being rejected
  */
export async function rejectFriendRequest(userId: string, senderId: string) {
  const user = await checkIfUserExistThenReturnUser(userId);
  const sender = await checkIfUserExistThenReturnUser(senderId);

  const friendRequest = user.friendRequestReceived.find(
    (request) => request.user?.toString() == sender.id
  );

  if (!friendRequest) {
    throw new ApiError(404, "Not Found", "Friend request not found.");
  } else if (friendRequest.status === "rejected") {
    throw new ApiError(400, "Bad Request", "Friend request already rejected");
  }

  const sendersFriendRequest = sender.friendRequestSent.find(
    (request) => request.user?.toString() == user.id
  );

  if (!sendersFriendRequest) {
    throw new ApiError(404, "Not Found", "Friend request not found.");
  }

  // Delete the friend request from user's friendRequestReceived array
  user.friendRequestReceived = user.friendRequestReceived.filter(
    (request) => request.user?.toString() !== sender._id.toString()
  );

  sendersFriendRequest.status = "rejected";

  await user.save();
  await sender.save();
  if (sender.fcmToken) {
    sendNotificationToSingleUser(
      sender.fcmToken,
      "Friend request",
      `${user.fullName} rejected your requets`
    );
  } else {
    console.log("Notification not sent, as reciever doesn't have fcmToken");
  }
}

export async function deleteRespondedFriendRequests(userId: string) {
  const user = await checkIfUserExistThenReturnUser(userId);
  // Delete the friend request from user's friendRequestReceived array
  user.friendRequestSent = user.friendRequestSent.filter(
    (request) => request.status === "pending"
  );

  await user.save();
}
