import { Router } from "express";
import * as AuthController from "./auth.controller";
import requireAuth from "../../middlewares/require-auth";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/me", requireAuth, AuthController.userInfo);
router.post('/refresh', requireAuth, AuthController.refresh)

export default router;
