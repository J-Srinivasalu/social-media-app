import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";
import fs from "fs";

cloudinary.config({
  cloud_name: config.clodinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinarySecretKey,
});

export const uploadOnCloudinary = async (
  localFilePath: string
): Promise<string | undefined> => {
  try {
    if (!localFilePath) return;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    //remove locally saved file
    console.log(`File uploaded on cloudinary ${response.url}`);
    return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    //remove locally saved file
    console.log(error);
  }
};
