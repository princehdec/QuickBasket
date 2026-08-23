import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { validate } from "../../shared/middleware/validate";
import { create, list, get } from "./orders.controller";
import { createOrderSchema } from "./orders.validation";

const router: Router = Router();

router.use(authenticate);
router.post("/", validate(createOrderSchema), create);
router.get("/", list);
router.get("/:id", get);

export default router;
