import { z } from "zod";

export const QuizViewSchema = z.object({
	playerId: z.string().optional()
});
