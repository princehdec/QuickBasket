import { Router } from "express";
import { authRouter } from "./auth/index";
import { businessesRouter } from "./businesses/index";
import { productsRouter } from "./products/index";
import { cartRouter } from "./cart/index";
import { ordersRouter } from "./orders/index";
import { usersRouter } from "./users/index";

const router = Router();

router.use("/auth", authRouter);
router.use("/businesses", businessesRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);

export default router;
