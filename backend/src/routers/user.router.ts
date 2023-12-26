import { Request, Response, Router } from "express";
import {
  getPublicProfileController,
  getUserController,
  updateUserController,
  setFcmTokenController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { handleMulterError, upload } from "../middlewares/multer.middleware";

const userRouter = Router();

userRouter.get("/", authenticate, (req: Request, res: Response) => {
  getUserController(req, res);
});
userRouter.get("/:userId", authenticate, (req: Request, res: Response) => {
  getPublicProfileController(req, res);
});

userRouter.post(
  "/",
  authenticate,
  upload.single("profilePic"),
  handleMulterError,
  (req: Request, res: Response) => {
    updateUserController(req, res);
  }
);

userRouter.post("/fcm", authenticate, (req: Request, res: Response) => {
  setFcmTokenController(req, res);
});

export default userRouter;
