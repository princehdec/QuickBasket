import { Router } from "express";
import { authRouter } from "./auth/index";
import { businessesRouter } from "./businesses/index";
import { productsRouter } from "./products/index";
import { cartRouter } from "./cart/index";
import { ordersRouter } from "./orders/index";
import { usersRouter } from "./users/index";
import serviceabilityRouter from "./serviceability/serviceability.routes";
import deliveryRouter from "./delivery/delivery.routes";
import deliveryAdminRouter from "./delivery/delivery.admin.routes";

const router: Router = Router();

router.use("/auth", authRouter);
router.use("/businesses", businessesRouter);
router.use("/products", productsRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/users", usersRouter);
router.use("/serviceability", serviceabilityRouter);
router.use("/delivery", deliveryRouter);
router.use("/admin/delivery", deliveryAdminRouter);

export default router;
