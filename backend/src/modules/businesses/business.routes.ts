import { Router } from "express";
import { validate } from "../../shared/middleware/validate";
import { authenticate } from "../../shared/middleware/authenticate";
import {
  createBusinessSchema,
  updateBusinessSchema,
  storeQuerySchema,
} from "./businesses.validation";
import {
  create,
  getAll,
  getMyBusinesses,
  getById,
  update,
  remove,
} from "./business.controller";

const router: Router = Router();

router.post("/", authenticate, validate(createBusinessSchema), create);
router.get("/", validate(storeQuerySchema, "query"), getAll);
router.get("/me", authenticate, getMyBusinesses);
router.get("/:id", getById);
router.patch("/:id", authenticate, validate(updateBusinessSchema), update);
router.delete("/:id", authenticate, remove);

export default router;
