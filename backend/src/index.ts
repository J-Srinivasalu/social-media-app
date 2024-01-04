import express from "express";
import http from "http";
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
import chatRouter from "./routers/chat.router";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/socket";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/health", healthRouter);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/test", testRouter);

initializeSocketIO(io);

const PORT = config.port;

connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
});
