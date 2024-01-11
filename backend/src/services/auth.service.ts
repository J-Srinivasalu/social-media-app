import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.util";
import ApiError from "../utils/error.util";
import { checkIfUserExistThenReturnUser } from "./user.service";

export async function registerUser(
  fullName: string,
  email: string,
  username: string,
  password: string
) {
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
    const refreshToken = generateRefreshToken(createdUser._id.toString());
    createdUser.refreshToken = refreshToken;
    createdUser.save();
    return { token: generateAccessToken(createdUser), refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError();
  }
}

export async function loginUser(email: string, password: string) {
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    throw new ApiError(404, "Not Found", "User not found");
  }

  const isMatch = bcrypt.compareSync(password, foundUser.password);
  if (!isMatch) {
    throw new ApiError(401, "Unauthorized", "Wrong credentials");
  }

  const refreshToken = generateRefreshToken(foundUser._id.toString());
  foundUser.refreshToken = refreshToken;
  foundUser.save();

  return { token: generateAccessToken(foundUser), refreshToken };
}

export async function logout(id: string) {
  const foundUser = await checkIfUserExistThenReturnUser(id);
  foundUser.refreshToken = undefined;
  foundUser.save();
}

export async function generateAccessAndRefreshToken(
  id: string,
  refreshToken: string
) {
  const foundUser = await checkIfUserExistThenReturnUser(id);

  if (foundUser.refreshToken !== refreshToken) {
    throw new ApiError(
      401,
      "Unauthorized",
      "Refresh token expired or already used"
    );
  }

  const token = generateAccessToken(foundUser);
  const newRefreshToken = generateRefreshToken(foundUser._id.toString());

  foundUser.refreshToken = newRefreshToken;
  foundUser.save();

  return { token, newRefreshToken };
}
