import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "./env";

const queryClient = postgres(env.DATABASE_URL, {
    debug(connection, query, params) {
        console.log("SQL:", query);
        console.log("PARAMS:", params);
    }
});

export const db = drizzle(queryClient);

export { queryClient };
