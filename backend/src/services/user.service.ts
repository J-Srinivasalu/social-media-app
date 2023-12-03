import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util";
import ApiError from "../utils/error.util";

export async function registerUser(
  fullName: string,
  email: string,
  username: string,
  password: string
): Promise<string> {
  const foundUserName = await User.findOne({ username: username });
  if (foundUserName) {
    throw new ApiError(
      400,
      "Already Exists",
      "Username is already in use; please try a different one."
    );
  }
  const foundEmail = await User.findOne({ email: email });
  if (foundEmail) {
    throw new ApiError(
      400,
      "Already Exist",
      "User already exist with this email."
    );
  }

  try {
    const createdUser = await User.create({
      fullName: fullName,
      email: email,
      username: username,
      password: password,
    });
    return generateToken(createdUser);
  } catch (error) {
    throw new ApiError();
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<string> {
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const isMatch = bcrypt.compareSync(password, foundUser.password);
  if (!isMatch) {
    throw new ApiError(401, "Unauthorized", "Wrong credentials");
  }
  return generateToken(foundUser);
}
