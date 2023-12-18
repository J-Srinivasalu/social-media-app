export class PublicProfile {
  userId: string;
  fullName: string;
  username: string;
  constructor(userId: string, fullName: string, username: string) {
    this.userId = userId;
    this.fullName = fullName;
    this.username = username;
  }
}
