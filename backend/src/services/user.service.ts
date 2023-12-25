import { PublicProfile } from "../models/publicProfile.model";
import User from "../models/user.model";
import ApiError from "../utils/error.util";

export async function getUser(id: string): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(id);

  console.log(user);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username,
    user.profilePic
  );

  return publicProfile;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(userId);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username,
    user.profilePic
  );

  return publicProfile;
}

export async function updateUser(
  userId: string,
  fullName: string,
  profilePic?: string
): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(userId);
  user.fullName = fullName;
  user.profilePic = profilePic;

  user.save();
  console.log(user);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username,
    user.profilePic
  );

  return publicProfile;
}

export async function setFcmToken(
  userId: string,
  fcmToken: string
): Promise<void> {
  const user = await checkIfUserExistThenReturnUser(userId);
  user.fcmToken = fcmToken;

  console.log(user);
  user.save();
}

export async function checkIfUserExistThenReturnUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }
  return user;
}
