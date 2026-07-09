import { Router } from "express";
import { validate } from "../../shared/middleware/validate";
import { authenticate } from "../../shared/middleware/authenticate";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validation";
import {
  register,
  login,
  refresh,
  logout,
  me,
} from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
