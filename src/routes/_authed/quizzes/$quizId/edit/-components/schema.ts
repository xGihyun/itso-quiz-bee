import { QuizStatus } from "@/lib/quiz";
import { z } from "zod";

export const CreateAnswerSchema = z.object({
	quizAnswerId: z.string().min(1, { message: "Required" }),
	content: z.string().min(1, { message: "Required" }),
	isCorrect: z.boolean()
});

export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;

export const CreateQuestionSchema = z.object({
	quizQuestionId: z.string().min(1, { message: "Required" }),
	content: z.string().min(1, { message: "Required" }),
	points: z.coerce.number(),
	duration: z.coerce.number().optional(),
	answers: CreateAnswerSchema.array()
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const CreateQuizSchema = z.object({
	quizId: z.string().min(1, { message: "Required" }),
	name: z.string().min(1, { message: "Required" }),
	description: z.string().optional(),
	status: z.nativeEnum(QuizStatus).default(QuizStatus.Closed),
	questions: CreateQuestionSchema.array()
});

export type CreateQuizInput = z.infer<typeof CreateQuizSchema>;
