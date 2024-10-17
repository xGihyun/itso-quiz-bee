import type { UsersTable } from "@/drizzle/schema";
import type { InferSelectModel } from "drizzle-orm";

export type User = Omit<
  InferSelectModel<typeof UsersTable>,
  "password" | "createdAt" | "updatedAt"
>;
