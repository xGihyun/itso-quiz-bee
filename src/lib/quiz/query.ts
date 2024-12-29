import { queryOptions } from "@tanstack/react-query";
import { getCurrentQuestion, getPlayers, getQuiz } from "./requests";
import { getResults } from "@/routes/_authed/quizzes/$quizId/view";

export const quizQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", quizId],
		queryFn: () => getQuiz(quizId)
	});

export const quizResultQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "results", quizId],
		queryFn: () => getResults(quizId)
	});

export const quizPlayersQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId],
		queryFn: () => getPlayers(quizId)
	});

export const quizCurrentQuestionQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "question", "current", quizId],
		queryFn: () => getCurrentQuestion(quizId)
	});
