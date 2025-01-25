import { queryOptions } from "@tanstack/react-query";
import { getCurrentQuestion, getPlayer, getPlayers, getQuiz } from "./requests";

export const quizQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", quizId],
		queryFn: () => getQuiz(quizId),
	});

export const playersQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId],
		queryFn: () => getPlayers(quizId),
	});

export const playerQueryOptions = (quizId: string, playerId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId, playerId],
		queryFn: () => getPlayer(quizId, playerId),
	});

export const quizCurrentQuestionQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "question", "current", quizId],
		queryFn: () => getCurrentQuestion(quizId),
	});
