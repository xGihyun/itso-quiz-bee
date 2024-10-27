import { z } from "astro:content";

export const NewLobbySchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().nullable(),
  capacity: z.coerce.number().nullable(),
  status: z.enum(["open", "closed"]),
});

export type NewLobbyInput = z.infer<typeof NewLobbySchema>
