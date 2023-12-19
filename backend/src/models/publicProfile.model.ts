import { Types } from "mongoose";

export class PublicProfile {
  userId: Types.ObjectId;
  fullName: string;
  username: string;
  profilePic: string | undefined | null;
  constructor(
    userId: Types.ObjectId,
    fullName: string,
    username: string,
    profilePic: string | undefined | null
  ) {
    this.userId = userId;
    this.fullName = fullName;
    this.username = username;
    this.profilePic = profilePic;
  }
}
