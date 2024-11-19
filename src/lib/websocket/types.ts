import {
  QuizQuestion,
  QuizQuestionVariant,
  QuizStatus,
  UpdateQuizStatusRequest,
} from "../quiz/types";

export enum WebSocketEvent {
  QuizUpdateStatus = "quiz-update-status",
  QuizStart = "quiz-start",
  QuizPause = "quiz-pause",
  QuizResume = "quiz-resume",
  QuizEnd = "quiz-end",
  QuizChangeQuestion = "quiz-change-question",
  QuizSubmitAnswer = "quiz-submit-answer",
  QuizSelectAnswer = "quiz-select-answer",
  QuizTypeAnswer = "quiz-type-answer",

  UserJoin = "user-join",
  UserLeave = "user-leave",

  Heartbeat = "heartbeat",
}

export type WebSocketRequest<T = unknown> = {
  event: WebSocketEvent;
  data: T;
};

export type WebSocketResponse<T = unknown> = {
  event: WebSocketEvent;
  data: T;
  user_id: string;
};

export type QuizStartRequest = {
  quiz_question_id: string;
} & UpdateQuizStatusRequest;

export type QuizChangeQuestionRequest = {
  quiz_id: string;
} & QuizQuestion;

export type QuizSubmitAnswerRequest<T = unknown> = {
  //user_id: string;
  quiz_question_id: string;
  quiz_id: string;
  variant: QuizQuestionVariant;
  answer: T;
};

export type QuizUpdateStatusRequest = {
  quiz_id: string;
  status: QuizStatus;
  quiz_question_id?: string;
};
