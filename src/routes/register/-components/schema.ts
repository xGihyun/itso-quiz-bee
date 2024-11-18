import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
