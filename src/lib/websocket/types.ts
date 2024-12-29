export enum WebSocketEvent {
	QuizUpdateStatus = "quiz-update-status",

	QuizStart = "quiz-start",
	//QuizPause = "quiz-pause",
	//QuizResume = "quiz-resume",
	//QuizEnd = "quiz-end",

	QuizUpdateQuestion = "quiz-update-question",
	QuizDisableAnswering = "quiz-disable-answering",

	QuizStartTimer = "quiz-start-timer",
	QuizTimerPass = "quiz-timer-pass",

	PlayerJoin = "player-join",
	PlayerLeave = "player-leave",
	PlayerSubmitAnswer = "player-submit-answer",
	PlayerTypeAnswer = "player-type-answer",

	Heartbeat = "heartbeat"
}

export type WebSocketRequest<T = any> = {
	event: WebSocketEvent;
	data: T;
};

export type WebSocketResponse<T = unknown> = {
	event: WebSocketEvent;
	data: T;
};
