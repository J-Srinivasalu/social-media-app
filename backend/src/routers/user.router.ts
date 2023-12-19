import { Request, Response, Router, response } from "express";
import {
  getPublicProfileController,
  getUserController,
  updateUserController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.get("/", authenticate, (req: Request, res: Response) => {
  getUserController(req, res);
});
userRouter.get("/public", authenticate, (req: Request, res: Response) => {
  getPublicProfileController(req, res);
});

userRouter.post(
  "/",
  authenticate,
  upload.single("image"),
  (req: Request, res: Response) => {
    updateUserController(req, res);
  }
);

export default userRouter;
