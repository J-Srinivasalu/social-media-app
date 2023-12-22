import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  getPostController,
  getPostsController,
  likePostController,
  uploadPostController,
} from "../controllers/post.controller";

const postRouter = Router();

postRouter.get("/", authenticate, (req: Request, res: Response) => {
  getPostsController(req, res);
});

//create post
postRouter.post(
  "/upload",
  authenticate,
  upload.array("medias"),
  (req: Request, res: Response) => {
    uploadPostController(req, res);
  }
);

//create post
postRouter.post("/like", authenticate, (req: Request, res: Response) => {
  likePostController(req, res);
});

export default postRouter;
