import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./shared/config/env.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import routes from "./modules/index.js";
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/v1", routes);
app.use(errorHandler);
app.listen(env.PORT, () => {
    console.log(`QuickBasket API running on port ${env.PORT}`);
});
export default app;
//# sourceMappingURL=index.js.map