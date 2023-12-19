import { PublicProfile } from "../models/publicProfile.model";
import User, { IUser } from "../models/user.model";
import ApiError from "../utils/error.util";

export async function getUser(id: string): Promise<Omit<IUser, "password">> {
  const user = await checkIfUserExistThenReturnUser(id);

  const sanitizedUser = sanitizeUser(user);

  return sanitizedUser;
}

function sanitizeUser(user: IUser): Omit<IUser, "password"> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile> {
  const user = await checkIfUserExistThenReturnUser(userId);

  const publicProfile = new PublicProfile(
    user._id,
    user.fullName,
    user.username
  );

  return publicProfile;
}

export async function updateUser(
  userId: string,
  fullName: string,
  profilePicUrl?: string
): Promise<IUser> {
  const user = await checkIfUserExistThenReturnUser(userId);
  user.fullName = fullName;
  user.profilePicUrl = profilePicUrl;

  return user;
}

export async function checkIfUserExistThenReturnUser(
  userId: string
): Promise<IUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }
  return user;
}
