import { Router, Request, Response } from "express";

const authRouter = Router();

//login router
authRouter.post("/login", (req: Request, res: Response) => {});

//register router
authRouter.post("/register", (req: Request, res: Response) => {});

export default authRouter;
