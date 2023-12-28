import express from "express";
import config from "./config/config";
import cors from "cors";
import authRouter from "./routers/auth.router";
import postRouter from "./routers/post.router";
import healthRouter from "./routers/health.router";
import connectDb from "./db/db";
import userRouter from "./routers/user.router";
import commentRouter from "./routers/comment.router";
import friendRouter from "./routers/friend.router";
import testRouter from "./routers/test.router";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/health", healthRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/friend", friendRouter);
app.use("/test", testRouter);

const PORT = config.port;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
