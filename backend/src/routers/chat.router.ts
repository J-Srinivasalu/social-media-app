import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getChatsController,
  getMessagesForChat,
  sendMessageController,
  createOrGetChatController,
  updateStatusController,
} from "../controllers/chat.controller";

const chatRouter = Router();

//get comments
chatRouter.post("/message", authenticate, (req: Request, res: Response) => {
  sendMessageController(req, res);
});

chatRouter.post(
  "/conversation",
  authenticate,
  (req: Request, res: Response) => {
    createOrGetChatController(req, res);
  }
);

chatRouter.post(
  "/message/status",
  authenticate,
  (req: Request, res: Response) => {
    updateStatusController(req, res);
  }
);

chatRouter.get("/conversation", authenticate, (req: Request, res: Response) => {
  getChatsController(req, res);
});

chatRouter.get("/message", authenticate, (req: Request, res: Response) => {
  getMessagesForChat(req, res);
});

export default chatRouter;
