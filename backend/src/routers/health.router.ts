import { Router, Request, Response } from "express";

const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Everything is up and running",
  });
});

export default healthRouter;
