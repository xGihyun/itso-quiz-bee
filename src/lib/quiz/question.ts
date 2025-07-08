import { queryOptions } from "@tanstack/react-query";
import { ApiResponse } from "../api/types";
import { QuizQuestion } from ".";
import { Interval } from "./timer";

export type QuizSetQuestionRequest = {
	quizId: string;
	quizQuestionId: string;
};

export type QuizCurrentQuestion = {
	question: QuizQuestion;
	interval?: Interval;
};

export const quizCurrentQuestionQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "question", "current", quizId],
		queryFn: () => getCurrentQuestion(quizId)
	});

export async function getCurrentQuestion(
	quizId: string
): Promise<ApiResponse<QuizCurrentQuestion>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/current-question`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<QuizCurrentQuestion> = await response.json();

	if (response.status === 404) {
		return result;
	}

	return result;
}
