import { Types } from "mongoose";

export class PublicProfile {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  profilePic: string | undefined | null;
  friends: number;
  constructor(
    _id: Types.ObjectId,
    fullName: string,
    username: string,
    profilePic: string | undefined | null,
    friends: number = 0
  ) {
    this._id = _id;
    this.fullName = fullName;
    this.username = username;
    this.profilePic = profilePic;
    this.friends = friends;
  }
}
