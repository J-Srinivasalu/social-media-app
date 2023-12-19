import { Types } from "mongoose";

export class PublicProfile {
  userId: Types.ObjectId;
  fullName: string;
  username: string;
  constructor(userId: Types.ObjectId, fullName: string, username: string) {
    this.userId = userId;
    this.fullName = fullName;
    this.username = username;
  }
}
