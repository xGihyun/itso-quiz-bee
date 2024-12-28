import { z } from "zod";

export const LoginSchema = z.object({
	username: z.string().min(1, { message: "Required" }),
	password: z.string().min(1, { message: "Required" })
});

export type LoginInput = z.infer<typeof LoginSchema>;
