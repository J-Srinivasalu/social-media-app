import express from "express";
import config from "./config/config";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routers/auth.router";
import postRouter from "./routers/post.router";
import healthRouter from "./routers/health.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/notes", postRouter);
app.use("/health", healthRouter);

const PORT = config.server.port;

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Connected to mongoDB.");
    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Unable to connect.");
    console.log(error);
  });
