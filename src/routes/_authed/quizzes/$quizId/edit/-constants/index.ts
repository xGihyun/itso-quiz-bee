import { QuizStatus } from "@/lib/quiz";
import {
	CreateQuizInput,
	type CreateAnswerInput,
	type CreateQuestionInput
} from "../-components/schema";
import { v4 as uuidv4 } from "uuid";

export function createDefaultQuiz(quizId: string): CreateQuizInput {
	return {
		quizId: quizId,
		name: "Untitled Quiz",
		description: "",
		status: QuizStatus.Closed,
		questions: [createDefaultQuestion()]
	};
}

export function createDefaultQuestion(): CreateQuestionInput {
	return {
		quizQuestionId: uuidv4(),
		points: 1,
		answers: [createDefaultAnswer()],
		content: "Untitled Question",
	};
}

export function createDefaultAnswer(): CreateAnswerInput {
	return {
		content: "Answer",
		isCorrect: true, // Assuming that the answer is written
		quizAnswerId: uuidv4()
	};
}
