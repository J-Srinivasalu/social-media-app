import {Request} from 'express';
import { Socket } from "socket.io";
import { IUser } from "../models/user.model";
import { JwtPayload } from "jsonwebtoken";

export interface CustomSocket extends Socket {
  user?: IUser; // or whatever type your user object is
}

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: DecodedToken;
}
