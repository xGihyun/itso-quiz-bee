import { z } from "zod";

export const JoinLobbySchema = z.object({
  code: z.string().min(6, { message: "Required" }),
});

export type JoinLobbyInput = z.infer<typeof JoinLobbySchema>;
