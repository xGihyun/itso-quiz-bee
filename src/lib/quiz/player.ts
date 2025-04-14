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
