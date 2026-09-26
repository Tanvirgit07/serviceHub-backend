import { Router } from "express";
import { authController } from "./auth.controller.js";

const authRouter = Router();
authRouter.post('/signup', authController.signup)
authRouter.post('/signin', authController.signin)
authRouter.post('/refresh', authController.refreshAccessToken)
authRouter.post('/logout', authController.logout);

export default authRouter;