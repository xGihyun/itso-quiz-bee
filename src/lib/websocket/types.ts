export enum WebSocketEvent {
	QuizUpdateStatus = "quiz-update-status",
	QuizUpdateQuestion = "quiz-update-question",
	QuizDisableAnswering = "quiz-disable-answering",
	QuizShowLeaderboard = "quiz-show-leaderboard",

	TimerPass = "timer-pass",
	TimerDone = "timer-done",

	PlayerJoin = "player-join",
	PlayerLeave = "player-leave",
	PlayerSubmitAnswer = "player-submit-answer",
	PlayerTypeAnswer = "player-type-answer",

	Heartbeat = "heartbeat",
}

export type WebSocketRequest<T = any> = {
	event: WebSocketEvent;
	data: T;
};

export type WebSocketResponse<T = unknown> = {
	event: WebSocketEvent;
	data: T;
};
