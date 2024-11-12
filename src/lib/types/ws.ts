export enum WebSocketEvent {
  QuizStart = "quiz-start",
  QuizPause = "quiz-pause",
  QuizResume = "quiz-resume",
  QuizEnd = "quiz-end",
  QuizNextQuestion = "quiz-next-question",
  QuizPreviousQuestion = "quiz-previous-question",
  UserJoin = "user-join",
  UserLeave = "user-leave",
}

export type WebSocketRequest<T = any> = {
  event: WebSocketEvent;
  data: T;
};
