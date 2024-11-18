import { RegisterSchema } from "@/routes/register/-components/schema";
import { z } from "zod";

export const CreateUserSchema = RegisterSchema
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
