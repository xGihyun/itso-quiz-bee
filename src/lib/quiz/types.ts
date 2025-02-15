export enum QuizStatus {
	Open = "open",
	Started = "started",
	Paused = "paused",
	Closed = "closed",
}

export type QuizBasicInfo = {
	quiz_id: string;
    created_at: string;
	name: string;
	description?: string;
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
	Written = "written",
}

export type QuizQuestion = {
	quiz_question_id: string;
	content: string;
	variant: QuizQuestionVariant;
	points: number;
	order_number: number;
	duration: number; // seconds
	answers: QuizAnswer[];
};

export type QuizUpdateStatusRequest = {
	quiz_id: string;
	status: QuizStatus;
};

export type QuizUpdatePlayersQuestionRequest = {
	quiz_id: string;
} & QuizQuestion;

export type CreateWrittenAnswerRequest = {
	content: string;
	quiz_question_id: string;
	user_id: string;
	quiz_id: string;
};
