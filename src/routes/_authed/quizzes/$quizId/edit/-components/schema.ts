import { QuizQuestionVariant, QuizStatus } from "@/lib/quiz/types";
import { z } from "zod";

export const CreateAnswerSchema = z.object({
	quiz_answer_id: z.string().min(1, { message: "Required" }),
	content: z.string().min(1, { message: "Required" }),
	is_correct: z.boolean()
});

export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;

export const CreateQuestionSchema = z.object({
	quiz_question_id: z.string().min(1, { message: "Required" }),
	content: z.string().min(1, { message: "Required" }),
	variant: z.nativeEnum(QuizQuestionVariant),
	points: z.coerce.number(),
	duration: z.coerce.number().optional(),
	answers: CreateAnswerSchema.array()
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const CreateQuizSchema = z.object({
	quiz_id: z.string().min(1, { message: "Required" }),
	name: z.string().min(1, { message: "Required" }),
	description: z.string().optional(),
	status: z.nativeEnum(QuizStatus).default(QuizStatus.Closed),
	questions: CreateQuestionSchema.array()
});

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
