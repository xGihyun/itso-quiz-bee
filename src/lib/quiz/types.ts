export enum QuizStatus {
	Open = "open",
	Started = "started",
	Paused = "paused",
	Closed = "closed",
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
	isCorrect: boolean;
};

export enum QuizQuestionVariant {
	MultipleChoice = "multiple-choice",
	Boolean = "boolean",
	Written = "written",
}

export type QuizQuestion = {
	quizQuestionId: string;
	content: string;
	variant: QuizQuestionVariant;
	points: number;
	orderNumber: number;
	duration: number; // seconds
	answers: QuizAnswer[];
};

export type QuizUpdateStatusRequest = {
	quizId: string;
	status: QuizStatus;
};

export type QuizUpdatePlayersQuestionRequest = {
	quizId: string;
} & QuizQuestion;

export type CreateWrittenAnswerRequest = {
	content: string;
	quizQuestionId: string;
	userId: string;
	quizId: string;
};
