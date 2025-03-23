import { Router } from "express";
import {
  loginUser,
  logout,
  myProfile,
  registerUser,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.get("/user/me", isAuth, myProfile);
router.post("/user/logout", logout);

export default router;
