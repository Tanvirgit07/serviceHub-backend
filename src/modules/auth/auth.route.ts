import { Router } from "express";
import { authController } from "./auth.controller.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const authRouter = Router();

authRouter.post('/signup', validateRequest(authValidation.signupSchema), authController.signup);
authRouter.post('/signin', validateRequest(authValidation.signinSchema), authController.signin);
authRouter.post('/refresh', validateRequest(authValidation.refreshTokenSchema), authController.refreshAccessToken);
authRouter.post('/logout', validateRequest(authValidation.refreshTokenSchema), authController.logout);

export default authRouter;