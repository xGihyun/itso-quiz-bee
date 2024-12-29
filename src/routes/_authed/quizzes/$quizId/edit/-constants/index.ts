import { QuizQuestionVariant, QuizStatus } from "@/lib/quiz/types";
import {
	CreateQuizInput,
	type CreateAnswerInput,
	type CreateQuestionInput
} from "../-components/schema";
import { v4 as uuidv4 } from "uuid";

export function createDefaultQuiz(quizId: string): CreateQuizInput {
	return {
		quiz_id: quizId,
		name: "Untitled Quiz",
		description: "",
		status: QuizStatus.Closed,
		questions: [createDefaultQuestion()]
	};
}

export function createDefaultQuestion(): CreateQuestionInput {
	return {
		quiz_question_id: uuidv4(),
		points: 1,
		answers: [createDefaultAnswer()],
		content: "Untitled Question",
		// The questions for the quiz bee are always written
		variant: QuizQuestionVariant.Written
	};
}

export function createDefaultAnswer(): CreateAnswerInput {
	return {
		content: "Answer",
		is_correct: true, // Assuming that the answer is written
		quiz_answer_id: uuidv4()
	};
}
