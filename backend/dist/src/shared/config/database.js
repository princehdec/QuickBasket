import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "./env.js";
const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient);
export { queryClient };
//# sourceMappingURL=database.js.map