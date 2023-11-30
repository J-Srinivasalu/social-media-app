import express from "express";
import config from "./config/config";
import cors from "cors";
import authRouter from "./routers/auth.router";
import postRouter from "./routers/post.router";
import healthRouter from "./routers/health.router";
import connectDb from "./db/db";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/notes", postRouter);
app.use("/health", healthRouter);

const PORT = config.port;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
