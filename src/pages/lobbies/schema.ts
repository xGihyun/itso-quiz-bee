import { z } from "astro/zod";

export const JoinLobbySchema = z.object({
  //user_id: z.string().min(1, { message: "Required" }),
  code: z.string().min(1, { message: "Required" }),
});

export type JoinLobbyInput = z.infer<typeof JoinLobbySchema>;
