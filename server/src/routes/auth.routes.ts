// src/routes/auth.routes.ts
import { Router } from "express";
import { authController } from "../controllers/auth.controller";

const router = Router();

// for authentication 
router.post("/signup", authController.signUp.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh-token", authController.rotateRefreshToken.bind(authController));
router.post("/logout", authController.logout.bind(authController));

export default router;
