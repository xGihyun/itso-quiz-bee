import { QuizQuestionVariant, QuizStatus } from "@/lib/quiz/types";
import { z } from "zod";

export const NewAnswerSchema = z.object({
  quiz_answer_id: z.string(),
  content: z.string(),
  is_correct: z.boolean(),
});

export type NewAnswerInput = z.infer<typeof NewAnswerSchema>;

export const NewQuestionSchema = z.object({
  quiz_question_id: z.string(),
  content: z.string(),
  variant: z.nativeEnum(QuizQuestionVariant),
  points: z.coerce.number(),
  //order_number: z.coerce.number(),
  answers: NewAnswerSchema.array(),
});

export type NewQuestionInput = z.infer<typeof NewQuestionSchema>;

export const NewQuizSchema = z.object({
  quiz_id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(QuizStatus),
  lobby_id: z.string().nullable(),
  questions: NewQuestionSchema.array(),
});

export type NewQuizInput = z.infer<typeof NewQuizSchema>;
