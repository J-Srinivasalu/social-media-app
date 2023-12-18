import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getCommentController,
  likeCommentController,
  uploadCommentController,
} from "../controllers/comment.controller";

const commentRouter = Router();

//get comments
commentRouter.get("/", authenticate, (req: Request, res: Response) => {
  getCommentController(req, res);
});

//create post
commentRouter.post("/upload", authenticate, (req: Request, res: Response) => {
  uploadCommentController(req, res);
});

//create post
commentRouter.post("/like", authenticate, (req: Request, res: Response) => {
  likeCommentController(req, res);
});

export default commentRouter;
