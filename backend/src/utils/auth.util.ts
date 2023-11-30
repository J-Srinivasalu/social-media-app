import config from "../config/config";
import { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

export function generateToken(user: IUser): string {
  return jwt.sign({ id: user._id, email: user.email }, config.secretKey);
}
