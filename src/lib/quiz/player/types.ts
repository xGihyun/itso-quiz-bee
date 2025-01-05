import { User } from "@/lib/user/types";

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

export type GetWrittenAnswerResponse = {
	player_written_answer_id: string;
	content: string;
};

