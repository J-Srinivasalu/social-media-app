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
    user.profilePicUrl
  );

  return publicProfile;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(userId);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username,
    user.profilePicUrl
  );

  return publicProfile;
}

export async function updateUser(
  userId: string,
  fullName: string,
  profilePicUrl?: string
): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(userId);
  user.fullName = fullName;
  user.profilePicUrl = profilePicUrl;

  user.save();
  console.log(user);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username,
    user.profilePicUrl
  );

  return publicProfile;
}

export async function checkIfUserExistThenReturnUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }
  return user;
}
