import { Router } from "express";
import authRoutes from "./auth.routes.js";
import storeRoutes from "./store.routes.js";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import orderRoutes from "./order.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();
router.use("/auth", authRoutes);
router.use("/stores", storeRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
export default router;
//# sourceMappingURL=index.js.map