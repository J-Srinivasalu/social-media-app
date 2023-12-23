import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { handleMulterError, upload } from "../middlewares/multer.middleware";
import {
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
  handleMulterError,
  (req: Request, res: Response) => {
    uploadPostController(req, res);
  }
);

//create post
postRouter.post("/like", authenticate, (req: Request, res: Response) => {
  likePostController(req, res);
});

export default postRouter;
