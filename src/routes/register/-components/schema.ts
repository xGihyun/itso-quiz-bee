import { UserRole } from "@/lib/user/types";
import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
  first_name: z.string().min(1, { message: "Required" }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: "Required" }),
  role: z.nativeEnum(UserRole).default(UserRole.Player)
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
