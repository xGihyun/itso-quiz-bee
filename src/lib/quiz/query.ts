import { queryOptions } from "@tanstack/react-query";
import { getCurrentQuestion, getPlayers, getQuiz } from "./requests";

export const quizQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", quizId],
		queryFn: () => getQuiz(quizId)
	});

export const playersQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "players", quizId],
		queryFn: () => getPlayers(quizId)
	});

export const quizCurrentQuestionQueryOptions = (quizId: string) =>
	queryOptions({
		queryKey: ["quiz", "question", "current", quizId],
		queryFn: () => getCurrentQuestion(quizId)
	});
