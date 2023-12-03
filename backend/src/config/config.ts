import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;

if (
  !MONGO_DB_URL ||
  !SECRET_KEY ||
  !CLOUDINARY_API_KEY ||
  !CLOUDINARY_CLOUD_NAME ||
  !CLOUDINARY_SECRET_KEY
) {
  console.log("Missing environment variable!!");
  process.exit(1);
}

const config = {
  dbUrl: MONGO_DB_URL,
  port: SERVER_PORT,
  secretKey: SECRET_KEY,
  clodinaryCloudName: CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: CLOUDINARY_API_KEY,
  cloudinarySecretKey: CLOUDINARY_SECRET_KEY,
};

export default config;
