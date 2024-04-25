import { Router } from "express";
import * as AuthController from "./auth.controller";
import requireAuthToken from "../../middlewares/require-auth";
import { TOKEN_TYPES } from "../../constants";
import validateSchema from "../../middlewares/schema-validator";
import { loginSchema, registerSchema } from "./validation";

const router = Router();

router.post("/login", validateSchema(loginSchema), AuthController.login);
router.post(
  "/register",
  validateSchema(registerSchema),
  AuthController.register
);
router.get(
  "/me",
  requireAuthToken(TOKEN_TYPES.ACCESS),
  AuthController.userInfo
);
router.post(
  "/refresh",
  requireAuthToken(TOKEN_TYPES.REFRESH),
  AuthController.refresh
);

export default router;
