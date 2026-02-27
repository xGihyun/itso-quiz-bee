export enum WebSocketEvent {
	QuizUpdateStatus = "quiz:update-status",
	QuizUpdateQuestion = "quiz:update-question",
	QuizDisableAnswering = "quiz:disable-answering",
	QuizShowLeaderboard = "quiz:show-leaderboard",

	TimerStart = "quiz:timer-start",
	TimerDone = "quiz:timer-done",

	PlayerJoin = "quiz:player-join",
	PlayerLeave = "quiz:player-leave",
	PlayerSubmitAnswer = "quiz:player-submit-answer",
	PlayerTypeAnswer = "quiz:player-type-answer",
	PlayerFocusWarning = "quiz:player-focus-warning",

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
