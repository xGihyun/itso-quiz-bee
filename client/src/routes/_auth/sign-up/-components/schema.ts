import { UserRole } from "@/lib/user";
import { z } from "zod";

export const SignUpSchema = z.object({
	username: z.string().min(1, { message: "Required" }),
	password: z.string().min(1, { message: "Required" }),
	name: z.string().min(1, { message: "Required" }),
	role: z.nativeEnum(UserRole).default(UserRole.Player)
});

export type SignUpInput = z.infer<typeof SignUpSchema>;
