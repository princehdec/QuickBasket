import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { vendorOnly } from "../../shared/middleware/authorize";
import { validate } from "../../shared/middleware/validate";
import { create, list, get, vendorList, vendorUpdateStatus } from "./orders.controller";
import { createOrderSchema } from "./orders.validation";

const router: Router = Router();

router.use(authenticate);
router.post("/", validate(createOrderSchema), create);
router.get("/", list);
router.get("/:id", get);
router.get("/vendor/queue", vendorOnly, vendorList);
router.patch("/vendor/:id/status", vendorOnly, vendorUpdateStatus);

export default router;
