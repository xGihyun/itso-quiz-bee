import { RegisterSchema } from "@/routes/_auth/register/-components/schema";
import { z } from "zod";

export const CreateUserSchema = RegisterSchema
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
