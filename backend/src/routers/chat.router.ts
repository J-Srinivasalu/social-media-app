import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getConversationsController,
  getMessagesForConversationController,
  sendMessageController,
  startConversationController,
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
    startConversationController(req, res);
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
  getConversationsController(req, res);
});

chatRouter.get("/message", authenticate, (req: Request, res: Response) => {
  getMessagesForConversationController(req, res);
});

export default chatRouter;
