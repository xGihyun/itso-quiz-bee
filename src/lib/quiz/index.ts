import { queryOptions } from "@tanstack/react-query";
import { ApiResponse } from "../api/types";

export enum QuizStatus {
	Open = "open",
	Started = "started",
	Paused = "paused",
	Closed = "closed"
}

export type QuizBasicInfo = {
	quizId: string;
	createdAt: string;
	name: string;
	description?: string;
	status: QuizStatus;
};

export type Quiz = {
	questions: QuizQuestion[];
} & QuizBasicInfo;

export type QuizAnswer = {
	quizAnswerId: string;
	content: string;
};

export type QuizQuestion = {
	quizQuestionId: string;
	content: string;
	points: number;
	orderNumber: number;
	duration: number; // seconds
	answers: QuizAnswer[];
};

export type QuizUpdateStatusRequest = {
	quizId: string;
	status: QuizStatus;
};

export const quizzesQueryOptions = queryOptions({
	queryKey: ["quizzes"],
	queryFn: getQuizzes
});

export async function getQuizzes(): Promise<ApiResponse<QuizBasicInfo[]>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
		{
			method: "GET",
			credentials: "include"
		}
	);
	const result: ApiResponse<QuizBasicInfo[]> = await response.json();

	return result;
}

export const quizQueryOptions = (quizId: string, includeAnswers: boolean = false) =>
	queryOptions({
		queryKey: ["quiz", quizId],
		queryFn: () => getQuiz(quizId, includeAnswers)
	});

export async function getQuiz(quizId: string, includeAnswers: boolean): Promise<ApiResponse<Quiz>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}?includeAnswers=${includeAnswers}`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<Quiz> = await response.json();

	return result;
}
