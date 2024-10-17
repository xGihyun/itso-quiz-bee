import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { DATABASE_URL } from "astro:env/server";
import postgres from "postgres";

async function runMigration() {
  const migrationClient = postgres(DATABASE_URL, { max: 1 });

  await migrate(drizzle(migrationClient), { migrationsFolder: "./migrations" });

  await migrationClient.end();
}

runMigration();
