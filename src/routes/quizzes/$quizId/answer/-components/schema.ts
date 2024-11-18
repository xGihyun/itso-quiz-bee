import { z } from "zod";

export const MultipleChoiceSchema = z.object({
  quiz_answer_id: z.string().min(1, { message: "Required." }),
});

export type MultipleChoiceInput = z.infer<typeof MultipleChoiceSchema>;

export const WrittenAnswerSchema = z.object({
  content: z.string().min(1, { message: "Please enter your answer." }),
  quiz_question_id: z.string().min(1, { message: "Required." }),
});

export type WrittenAnswerInput = z.infer<typeof WrittenAnswerSchema>;
