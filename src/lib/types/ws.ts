import { UpdateQuizStatusRequest } from "@/routes/quizzes/-types";

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

export type QuizStartRequest = {
  quiz_question_id: string;
} & UpdateQuizStatusRequest;

export type QuizNextQuestionRequest = {
  quiz_question_id: string;
  quiz_id: string;
};
