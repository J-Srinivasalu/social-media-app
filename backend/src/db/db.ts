import mongoose from "mongoose";
import config from "../config/config";

export default async function connectDb() {
  try {
    const connectionInstance = await mongoose.connect(config.dbUrl);
    console.log("Connection to DB established");
    console.log(`Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Connection to DB failed");
    console.log(error);
    process.exit(1);
  }
}
