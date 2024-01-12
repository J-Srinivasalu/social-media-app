import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getChatsController,
  sendMessageController,
  createOrGetChatController,
  getMessagesForChatController,
  sendVideoCallRequestController,
  rejectVideoCallRequestController,
} from "../controllers/chat.controller";

const chatRouter = Router();

chatRouter.post("/message", authenticate, (req: Request, res: Response) => {
  sendMessageController(req, res);
});

chatRouter.post("/", authenticate, (req: Request, res: Response) => {
  createOrGetChatController(req, res);
});

chatRouter.get("/", authenticate, (req: Request, res: Response) => {
  getChatsController(req, res);
});

chatRouter.get("/message", authenticate, (req: Request, res: Response) => {
  getMessagesForChatController(req, res);
});

chatRouter.post(
  "/call/video/offer",
  authenticate,
  (req: Request, res: Response) => {
    sendVideoCallRequestController(req, res);
  }
);

chatRouter.post(
  "/call/video/reject",
  authenticate,
  (req: Request, res: Response) => {
    rejectVideoCallRequestController(req, res);
  }
);

export default chatRouter;
