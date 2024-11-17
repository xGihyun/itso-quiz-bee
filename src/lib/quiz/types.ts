export enum QuizStatus {
  Open = "open",
  Started = "started",
  Paused = "paused",
  Closed = "closed",
}

export type QuizBasicInfo = {
  quiz_id: string;
  name: string;
  description?: string;
  status: QuizStatus;
  lobby_id?: string;
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
  Written = "written",
}

export type QuizQuestion = {
  quiz_question_id: string;
  content: string;
  variant: QuizQuestionVariant;
  points: number;
  order_number: number;
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
