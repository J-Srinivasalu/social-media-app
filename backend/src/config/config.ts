import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!MONGO_DB_URL || !SECRET_KEY) {
  console.log("Missing environment variable!!");
  process.exit(1);
}

const config = {
  dbUrl: MONGO_DB_URL,
  port: SERVER_PORT,
  secretKey: SECRET_KEY,
};

export default config;
