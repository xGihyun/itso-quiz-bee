import { UserRole } from "@/lib/user/types";
import { z } from "zod";

export const RegisterSchema = z.object({
	username: z.string().min(1, { message: "Required" }),
	password: z.string().min(1, { message: "Required" }),
	name: z.string().min(1, { message: "Required" }),
	role: z.nativeEnum(UserRole).default(UserRole.Player)
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
