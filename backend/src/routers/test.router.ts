import { Router } from "express";
import { notifyTestController } from "../controllers/test.controller";

const testRouter = Router();

testRouter.post("/notify", notifyTestController);

export default testRouter;
