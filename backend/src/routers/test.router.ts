import { Request, Response, Router } from "express";
import { notifyTestController } from "../controllers/test.controller";

const testRouter = Router();

testRouter.post(
  "/notify",
  (req: Request, res: Response) => notifyTestController
);

export default testRouter;
