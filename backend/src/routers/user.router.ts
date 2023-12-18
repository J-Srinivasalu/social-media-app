import { Request, Response, Router } from "express";
import {
  getPublicProfileController,
  getUserController,
} from "../controllers/user.controller";
import { authenticate } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.get("/", authenticate, (req: Request, res: Response) => {
  getUserController(req, res);
});
userRouter.get("/public", authenticate, (req: Request, res: Response) => {
  getPublicProfileController(req, res);
});

export default userRouter;
