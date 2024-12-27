import { RegisterSchema } from "@/routes/(auth)/register/-components/schema";
import { z } from "zod";

export const CreateUserSchema = RegisterSchema
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
