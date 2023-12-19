import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  getPostController,
  getPostsByUserController,
  likePostController,
  uploadPostController,
} from "../controllers/post.controller";

const postRouter = Router();

//get posts
postRouter.get("/", authenticate, (req: Request, res: Response) => {
  getPostController(req, res);
});

postRouter.get("/:userId", authenticate, (req: Request, res: Response) => {
  getPostsByUserController(req, res);
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
