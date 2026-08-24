import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./shared/config/env";
import { errorHandler } from "./shared/middleware/errorHandler";
import routes from "./modules/index";

const app: express.Express = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean) }));
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
