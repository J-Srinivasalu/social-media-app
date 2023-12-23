import { Types } from "mongoose";

export class PublicProfile {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  profilePic: string | undefined | null;
  constructor(
    _id: Types.ObjectId,
    fullName: string,
    username: string,
    profilePic: string | undefined | null
  ) {
    this._id = _id;
    this.fullName = fullName;
    this.username = username;
    this.profilePic = profilePic;
  }
}
