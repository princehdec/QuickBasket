import { Router } from "express";
import { authRouter } from "./auth/index.js";
import { businessesRouter } from "./businesses/index.js";
import { productsRouter } from "./products/index.js";
import { cartRouter } from "./cart/index.js";
import { ordersRouter } from "./orders/index.js";
import { usersRouter } from "./users/index.js";
const router = Router();
router.use("/auth", authRouter);
router.use("/stores", businessesRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);
export default router;
//# sourceMappingURL=index.js.map