import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  getPostController,
  uploadPostController,
} from "../controllers/post.controller";

const postRouter = Router();

//get post / posts
postRouter.get("/", authenticate, (req: Request, res: Response) => {
  getPostController(req, res);
});

//create post
postRouter.post(
  "/upload",
  authenticate,
  upload.single("image"),
  (req: Request, res: Response) => {
    uploadPostController(req, res);
  }
);

export default postRouter;
