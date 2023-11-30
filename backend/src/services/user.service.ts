import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util";
import ApiError from "../utils/error.util";

export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const foundUser = await User.findOne({ email: email });
  if (foundUser) {
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
