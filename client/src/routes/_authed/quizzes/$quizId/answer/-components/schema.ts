import { z } from "zod";

export const WrittenAnswerSchema = z.object({
  content: z.string().min(1, { message: "Please enter your answer." }),
  quizQuestionId: z.string().min(1, { message: "Required." }),
});

export type WrittenAnswerInput = z.infer<typeof WrittenAnswerSchema>;
