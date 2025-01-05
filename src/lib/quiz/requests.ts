import { ApiResponse } from "../api/types";
import { GetWrittenAnswerResponse, Player } from "./player/types";
import { Quiz, QuizBasicInfo, QuizQuestion } from "./types";

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

export async function getCurrentQuestion(
	quizId: string
): Promise<ApiResponse<QuizQuestion>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/questions/current`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<QuizQuestion> = await response.json();

	return result;
}

export async function getCurrentAnswer(
	quizId: string
): Promise<ApiResponse<GetWrittenAnswerResponse | null>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/users/answers`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<GetWrittenAnswerResponse | null> =
		await response.json();

	return result;
}

export async function getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<Quiz> = await response.json();

	return result;
}

export async function getPlayers(
	quizId: string
): Promise<ApiResponse<Player[]>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/players`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<Player[]> = await response.json();

	return result;
}
