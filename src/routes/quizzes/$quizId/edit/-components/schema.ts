import { QuizStatus } from "@/routes/quizzes/-types";
import { z } from "zod";

export const NewAnswerSchema = z.object({
  content: z.string(),
  is_correct: z.boolean(),
});

export type NewAnswerInput = z.infer<typeof NewAnswerSchema>;

export enum QuestionVariant {
  MultipleChoice = "multiple-choice",
  Boolean = "boolean",
  Written = "written",
}

export const NewQuestionSchema = z.object({
  content: z.string(),
  variant: z.nativeEnum(QuestionVariant),
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
  lobby_id: z.string().optional(),
  questions: NewQuestionSchema.array(),
});

export type NewQuizInput = z.infer<typeof NewQuizSchema>;
