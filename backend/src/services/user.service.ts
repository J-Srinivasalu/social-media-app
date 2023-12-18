import { PublicProfile } from "../models/publicProfile.model";
import User, { IUser } from "../models/user.model";
import ApiError from "../utils/error.util";

export async function getUser(id: string): Promise<Omit<IUser, "password">> {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const sanitizedUser = sanitizeUser(user);

  return sanitizedUser;
}

function sanitizeUser(user: IUser): Omit<IUser, "password"> {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

export async function getPublicProfile(
  username: string
): Promise<PublicProfile> {
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const publicProfile = new PublicProfile(
    user.id,
    user.fullName,
    user.username
  );

  return publicProfile;
}
