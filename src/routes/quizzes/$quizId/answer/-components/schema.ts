import { z } from "zod";

export const MultipleChoiceSchema = z.object({
  quiz_answer_id: z.string(),
});

export type MultipleChoiceInput = z.infer<typeof MultipleChoiceSchema>;

export const WrittenAnswerSchema = z.object({
  content: z.string(),
  quiz_question_id: z.string(),
});

export type WrittenAnswerInput = z.infer<typeof WrittenAnswerSchema>;
