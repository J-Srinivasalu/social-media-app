import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_SECRET_KEY = process.env.CLOUDINARY_SECRET_KEY;
const FIREBASE_SERVICE_ACCOUNT_FILE = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

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

if (!FIREBASE_SERVICE_ACCOUNT_FILE) {
  console.log(
    "Firebse service secret file missing, notification service won't work!"
  );
  process.exit(1);
}

const config = {
  dbUrl: MONGO_DB_URL,
  port: SERVER_PORT,
  secretKey: SECRET_KEY,
  clodinaryCloudName: CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: CLOUDINARY_API_KEY,
  cloudinarySecretKey: CLOUDINARY_SECRET_KEY,
  firebaseServiceFilePath: FIREBASE_SERVICE_ACCOUNT_FILE,
  corsOrigin: CORS_ORIGIN,
};

export default config;
