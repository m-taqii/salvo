import { Router } from "express";
import { registerUser, loginUser, logoutUser, getLoggedInUser } from "../../controllers/auth/user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, getLoggedInUser);

export default router;