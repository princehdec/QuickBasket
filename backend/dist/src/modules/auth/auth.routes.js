import { Router } from "express";
import { validate } from "../../shared/middleware/validate.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { registerSchema, loginSchema, refreshSchema, } from "./auth.validation.js";
import { register, login, refresh, logout, me, } from "./auth.controller.js";
const router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);
export default router;
//# sourceMappingURL=auth.routes.js.map