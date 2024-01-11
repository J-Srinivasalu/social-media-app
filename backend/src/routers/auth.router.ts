import { Router, Request, Response } from "express";
import {
  registerController,
  loginController,
  refreshAccessTokenController,
  logoutController,
} from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const authRouter = Router();

//login router
authRouter.post("/login", (res: Request, req: Response) => {
  loginController(res, req);
});

//register router
authRouter.post("/register", (res: Request, req: Response) => {
  registerController(res, req);
});

authRouter.post("/refresh-token", (res: Request, req: Response) => {
  refreshAccessTokenController(res, req);
});

authRouter.post("/logout", authenticate, (res: Request, req: Response) => {
  logoutController(res, req);
});

export default authRouter;
