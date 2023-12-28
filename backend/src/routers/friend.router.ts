import { Request, Response, Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  AcceptFriendRequestController,
  rejectFriendRequestController,
  sendFriendRequestController,
  unfriendRequestController,
} from "../controllers/friend.controller";

const friendRouter = Router();

friendRouter.post("/request", authenticate, (req: Request, res: Response) => {
  sendFriendRequestController(req, res);
});

friendRouter.post("/accept", authenticate, (req: Request, res: Response) => {
  AcceptFriendRequestController(req, res);
});

friendRouter.post("/reject", authenticate, (req: Request, res: Response) => {
  rejectFriendRequestController(req, res);
});

friendRouter.post("/unfriend", authenticate, (req: Request, res: Response) => {
  unfriendRequestController(req, res);
});

export default friendRouter;
