import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate";
import { validate } from "../../shared/middleware/validate";
import { create, update, list, remove } from "./address.controller";
import { createAddressSchema, updateAddressSchema } from "./address.validation";

const router = Router();
router.use(authenticate);
router.get("/", list);
router.post("/", validate(createAddressSchema), create);
router.patch("/:id", validate(updateAddressSchema), update);
router.delete("/:id", remove);

export default router;
