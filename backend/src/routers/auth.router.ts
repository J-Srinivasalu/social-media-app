import { Router, Request, Response } from "express";
import {
  registerController,
  loginController,
} from "../controllers/auth.controller";

const authRouter = Router();

//login router
authRouter.post("/login", (res: Request, req: Response) => {
  loginController(res, req);
});

//register router
authRouter.post("/register", (res: Request, req: Response) => {
  registerController(res, req);
});

export default authRouter;
