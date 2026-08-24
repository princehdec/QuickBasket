import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "./env";

function normalizeDatabaseUrl(databaseUrl: string): string {
  const schemeEnd = databaseUrl.indexOf("://");
  const authorityStart = schemeEnd + 3;
  const atIndex = databaseUrl.lastIndexOf("@");

  if (schemeEnd < 0 || atIndex <= authorityStart) {
    return databaseUrl;
  }

  const authority = databaseUrl.slice(authorityStart, atIndex);
  const separatorIndex = authority.indexOf(":");

  if (separatorIndex < 0) {
    return databaseUrl;
  }

  const username = authority.slice(0, separatorIndex);
  const password = authority.slice(separatorIndex + 1);

  let decodedPassword = password;
  try {
    decodedPassword = decodeURIComponent(password);
  } catch {
    // A raw '%' is common in database passwords. Treat malformed escapes as
    // literal characters, then encode the complete password safely.
    decodedPassword = password;
  }

  const encodedPassword = encodeURIComponent(decodedPassword);
  return `${databaseUrl.slice(0, authorityStart)}${username}:${encodedPassword}${databaseUrl.slice(atIndex)}`;
}

const queryClient = postgres(normalizeDatabaseUrl(env.DATABASE_URL),
  env.NODE_ENV === "production"
    ? {}
    : {
        debug(connection, query, params) {
          console.log("SQL:", query);
          console.log("PARAMS:", params);
        },
      }
);

export const db = drizzle(queryClient);

export { queryClient };
