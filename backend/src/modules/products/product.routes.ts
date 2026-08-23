import { Router } from "express";
import { validate } from "../../shared/middleware/validate";
import { authenticate } from "../../shared/middleware/authenticate";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "./products.validation";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "./product.controller";

const router: Router = Router();

router.post("/", authenticate, validate(createProductSchema), create);
router.get("/", validate(productQuerySchema, "query"), getAll);
router.get("/:id", getById);
router.patch("/:id", authenticate, validate(updateProductSchema), update);
router.delete("/:id", authenticate, remove);

export default router;
