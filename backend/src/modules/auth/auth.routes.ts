import { Router } from "express";
import { validate } from "../../shared/middleware/validate";
import { authenticate } from "../../shared/middleware/authenticate";
import { sendOtpSchema, verifyOtpSchema, refreshSchema } from "./auth.validation";
import { sendOtp, verifyOtp, refresh, logout, me } from "./auth.controller";

const router: Router = Router();

router.post("/otp/send", validate(sendOtpSchema), sendOtp);
router.post("/otp/verify", validate(verifyOtpSchema), verifyOtp);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;
