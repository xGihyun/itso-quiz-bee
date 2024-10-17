import { db } from "@/drizzle/database";
import { UsersTable } from "@/drizzle/schema";
import { LoginSchema } from "@/pages/login/schema";
import { RegisterSchema } from "@/pages/register/schema";
import { ActionError, defineAction } from "astro:actions";
import { and, eq } from "drizzle-orm";

export const server = {
  register: defineAction({
    input: RegisterSchema,
    handler: async (data, context) => {
      if (context.cookies.has("session")) {
        throw new ActionError({
          code: "CONFLICT",
          message: "User session exists.",
        });
      }

      console.log("Register:", data);

      await db.insert(UsersTable).values({
        email: data.email,
        password: data.password,
        role: "player",
      });
    },
  }),
  login: defineAction({
    input: LoginSchema,
    handler: async (data, context) => {
      if (context.cookies.has("session")) {
        console.error("User session exists.");
        throw new ActionError({
          code: "CONFLICT",
          message: "User session exists.",
        });
      }

      console.log("Login:", data);

      const users = await db
        .select()
        .from(UsersTable)
        .where(
          and(
            eq(UsersTable.email, data.email),
            eq(UsersTable.password, data.password),
          ),
        )
        .limit(1);

      if (users.length <= 0) {
        console.error("Invalid user credentials.");
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Invalid user credentials.",
        });
      }

      context.cookies.set("session", users[0].id, {
        sameSite: "lax",
        secure: import.meta.env.PROD,
        path: "/",
      });
    },
  }),
};
