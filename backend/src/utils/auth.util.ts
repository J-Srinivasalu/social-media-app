import config from "../config/config";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

export function generateAccessToken(user: IUser): string {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.accessTokenSecretKey,
    {
      expiresIn: "1d",
    }
  );
}

export function generateRefreshToken(id: string): string {
  return jwt.sign({ id }, config.refreshTokenSecretKey, {
    expiresIn: "5d",
  });
}
