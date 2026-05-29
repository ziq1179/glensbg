import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import authRouter from "./auth";
import photosRouter from "./photos";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(authRouter);
router.use(photosRouter);
router.use(settingsRouter);

export default router;
