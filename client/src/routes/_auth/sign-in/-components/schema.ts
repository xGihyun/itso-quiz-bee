import { z } from "zod";

export const SignInSchema = z.object({
	username: z.string().min(1, { message: "Required" }),
	password: z.string().min(1, { message: "Required" })
});

export type SignInInput = z.infer<typeof SignInSchema>;
