import { Router, Request, Response } from "express";

const postRouter = Router();

//create post
postRouter.post("/post", (req: Request, res: Response) => {});

//get post / posts
postRouter.get("/post", (req: Request, res: Response) => {});

export default postRouter;
