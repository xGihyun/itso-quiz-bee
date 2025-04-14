import { queryOptions } from "@tanstack/react-query";
import { ApiResponse } from "../api/types";
import { User } from "../user";

export type Player = {
	result: PlayerResult;
} & User;

export type PlayerAnswer = {
	player_answer_id: string;
	content: string;
	is_correct: boolean;
	quiz_question_id: string;
};

export type PlayerResult = {
	score: number;
	answers: PlayerAnswer[];

	currentAnswer?: string;
};

export const playerQueryOptions = (quizId: string, playerId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId, playerId],
		queryFn: () => getPlayer(quizId, playerId)
	});

export async function getPlayer(
	quizId: string,
	playerId: string
): Promise<ApiResponse<Player>> {
	const response = await fetch(
		`${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/players/${playerId}`,
		{
			method: "GET",
			credentials: "include"
		}
	);

	const result: ApiResponse<Player> = await response.json();

	return result;
}

export const playersQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId],
		queryFn: () => getPlayers(quizId)
	});

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

export type JoinQuizRequest = {
	userId: string;
	quizId: string;
};

export type CreateWrittenAnswerRequest = {
	content: string;
	quizQuestionId: string;
	userId: string;
	quizId: string;
};

export type GetWrittenAnswerResponse = {
	player_written_answer_id: string;
	content: string;
};

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
