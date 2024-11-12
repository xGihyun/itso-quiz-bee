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
