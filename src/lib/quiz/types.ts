import {
	MultipleChoiceInput,
	WrittenAnswerInput
} from "@/routes/_auth/quizzes/$quizId/answer/-components/schema";
import { WebSocketEvent } from "../websocket/types";

export enum QuizStatus {
	Open = "open",
	Started = "started",
	Paused = "paused",
	Closed = "closed"
}

export type QuizBasicInfo = {
	quiz_id: string;
	name: string;
	description?: string;
	status: QuizStatus;
};

export type UpdateQuizStatusRequest = {
	quiz_id: string;
	status: QuizStatus;
};

export type Quiz = {
	questions: QuizQuestion[];
} & QuizBasicInfo;

export type QuizAnswer = {
	quiz_answer_id: string;
	content: string;
	is_correct: boolean;
};

export enum QuizQuestionVariant {
	MultipleChoice = "multiple-choice",
	Boolean = "boolean",
	Written = "written"
}

export type QuizQuestion = {
	quiz_question_id: string;
	content: string;
	variant: QuizQuestionVariant;
	points: number;
	order_number: number;
	duration: number; // nanoseconds
	answers: QuizAnswer[];
};

export type PlayerAnswer = {
	player_answer_id: string;
	quiz_question_id: string;
} & QuizAnswer;

export type PlayerScore = {
	score: number;
	user_id: string;
};

export type QuizResult = {
	answers: PlayerAnswer[];
} & PlayerScore;

export type GetAnswerRequest = {
	quiz_question_id: string;
};

export type GetWrittenAnswerResponse = {
	player_written_answer_id: string;
	content: string;
};

export type PlayerCurrentAnswer =
	| {
			event: WebSocketEvent.QuizSelectAnswer;
			data: MultipleChoiceInput;
	  }
	| {
			event: WebSocketEvent.QuizTypeAnswer;
			data: WrittenAnswerInput;
	  };

export type QuizUser = {
	user_id: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
};

type PlayerAnswerState = {
	current: PlayerCurrentAnswer;
	result: QuizResult;
};

export type QuizWrittenAnswerRequest = {
	user_id: string;
} & WrittenAnswerInput;
