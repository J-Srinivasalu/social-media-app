import mongoose, { InferSchemaType, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

type IUser = InferSchemaType<typeof userSchema>;

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
