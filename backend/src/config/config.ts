import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL ?? "";
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const config = {
  mongo: {
    url: MONGO_DB_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};

export default config;
