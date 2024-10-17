import { z } from "astro/zod";

export const LoginSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

export type LoginInput = z.infer<typeof LoginSchema>
