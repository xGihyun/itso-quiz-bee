import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  QuizChangeQuestionRequest,
  QuizStartRequest,
  WebSocketEvent,
  WebSocketRequest,
  WebSocketResponse,
} from "@/lib/websocket/types";
import {
  Quiz,
  QuizQuestion,
  QuizQuestionVariant,
  QuizResult,
  QuizStatus,
} from "@/lib/quiz/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCurrentQuestion } from "@/lib/quiz/requests";
import {
  MultipleChoiceInput,
  WrittenAnswerInput,
} from "../answer/-components/schema";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/quizzes/$quizId/view/")({
  component: RouteComponent,
});

// NOTE:
// This is where admin will view all the current participants
// Admin can see the players' current answers in real-time
// Admin can move to the next/previous question

type PlayerCurrentAnswer =
  | {
      event: WebSocketEvent.QuizSelectAnswer;
      data: MultipleChoiceInput;
    }
  | {
      event: WebSocketEvent.QuizTypeAnswer;
      data: WrittenAnswerInput;
    };

type PlayerAnswerState = {
  current: PlayerCurrentAnswer;
  result: QuizResult;
};

function RouteComponent(): JSX.Element {
  const params = Route.useParams();

  //const [playerResults, setPlayerResults] = useState<
  //  Map<string, PlayerAnswerState>
  //>(new Map());
  const [playerAnswers, setPlayerAnswers] = useState<
    Map<string, PlayerCurrentAnswer>
  >(new Map());

  const quizQuery = useQuery({
    queryKey: ["quiz"],
    queryFn: () => getQuiz(params.quizId),
  });
  const currentQuestionQuery = useQuery({
    queryKey: ["current-question"],
    queryFn: () => getCurrentQuestion(params.quizId),
  });
  const playersQuery = useQuery({
    queryKey: ["players"],
    queryFn: () => getPlayers(params.quizId),
  });
  const quizResultsQuery = useQuery({
    queryKey: ["quiz-results"],
    queryFn: () => getResults(params.quizId),
  });

  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketResponse = await JSON.parse(event.data);

      switch (result.event) {
        case WebSocketEvent.UserJoin:
          // NOTE:
          // Probably not a good idea to constantly refetch on player join
          await playersQuery.refetch();
          break;
        case WebSocketEvent.QuizStart:
          toast.info("Quiz has started!");
          break;

        case WebSocketEvent.QuizChangeQuestion:
          toast.info("Next question!");

          // NOTE: Probably not the best idea but it works
          await currentQuestionQuery.refetch();
          break;

        case WebSocketEvent.QuizSelectAnswer:
          {
            const data = result.data as MultipleChoiceInput;

            setPlayerAnswers((prevAnswers) => {
              const newAnswers = new Map(prevAnswers);
              newAnswers.set(result.user_id, {
                event: WebSocketEvent.QuizSelectAnswer,
                data,
              });
              return newAnswers;
            });
          }
          break;

        case WebSocketEvent.QuizTypeAnswer:
          {
            const data = result.data as WrittenAnswerInput;

            setPlayerAnswers((prevAnswers) => {
              const newAnswers = new Map(prevAnswers);
              newAnswers.set(result.user_id, {
                event: WebSocketEvent.QuizTypeAnswer,
                data,
              });
              return newAnswers;
            });
          }
          break;

        case WebSocketEvent.QuizSubmitAnswer:
          // NOTE:
          // Probably not a good idea to constantly refetch on each submission
          await quizResultsQuery.refetch();
          break;

        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    ...WEBSOCKET_OPTIONS,
  });

  if (
    quizQuery.isPending ||
    currentQuestionQuery.isPending ||
    playersQuery.isPending ||
    quizResultsQuery.isPending
  ) {
    return <Skeleton className="w-20 h-20" />;
  }

  if (quizQuery.isError) {
    return <QueryError message={quizQuery.error.message} />;
  }

  if (currentQuestionQuery.isError) {
    return <QueryError message={currentQuestionQuery.error.message} />;
  }

  if (playersQuery.isError) {
    return <QueryError message={playersQuery.error.message} />;
  }

  if (quizResultsQuery.isError) {
    return <QueryError message={quizResultsQuery.error.message} />;
  }

  const quiz = quizQuery.data.data;
  const currentQuestion = currentQuestionQuery.data.data;
  const players = playersQuery.data.data;
  const quizResults = quizResultsQuery.data.data;

  return (
    <div>
      <Button
        onClick={() =>
          startQuiz(socket, {
            quiz_id: params.quizId,
            quiz_question_id: quiz.questions[0].quiz_question_id,
            status: QuizStatus.Started,
          })
        }
        disabled={socket.readyState !== ReadyState.OPEN}
      >
        Start
      </Button>

      <h2 className="text-2xl my-2 font-bold">Questions</h2>

      <RadioGroup
        className="grid-cols-4"
        defaultValue={
          currentQuestion
            ? currentQuestion.quiz_question_id
            : quiz.questions[0].quiz_question_id
        }
      >
        {quiz.questions.map((question) => {
          return (
            <label
              className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
              key={question.quiz_question_id}
            >
              <RadioGroupItem
                id={question.quiz_question_id}
                value={question.quiz_question_id}
                className="sr-only after:absolute after:inset-0"
                onClick={() =>
                  changeQuestion(socket, {
                    quiz_id: params.quizId,
                    ...question,
                  })
                }
                disabled={socket.readyState !== ReadyState.OPEN}
              />
              <p>{question.content}</p>
            </label>
          );
        })}
      </RadioGroup>

      <h2 className="text-2xl my-2 font-bold">Players</h2>
      <div>
        {players.map((player) => {
          const answer = playerAnswers.get(player.user_id);
          const result = quizResults.find(
            (result) => result.user_id === player.user_id,
          );

          return (
            <Player
              key={player.user_id}
              question={currentQuestion}
              player={player}
              answer={answer}
              result={result}
            />
          );
        })}
      </div>
    </div>
  );
}

type PlayerProps = {
  player: QuizUser;
  answer?: PlayerCurrentAnswer;
  question: QuizQuestion | null;
  result?: QuizResult;
};

function Player(props: PlayerProps): JSX.Element {
  let answerContent = "";

  if (props.question) {
    if (props.answer?.event === WebSocketEvent.QuizSelectAnswer) {
      const answerId = props.answer.data.quiz_answer_id;
      answerContent =
        props.question.answers.find((value) => value.quiz_answer_id == answerId)
          ?.content || "No answer.";
    } else {
      answerContent = props.answer?.data.content || "No answer.";
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold">Player:</h2>
        <p>
          {props.player.first_name} {props.player.last_name}
        </p>
      </div>

      <div>
        <h2 className="font-bold">Current Answer:</h2>
        <p>{answerContent}</p>
      </div>

      <div>
        <h2 className="font-bold">Score:</h2>
        {props.result ? <div>{props.result.score}</div> : 0}
      </div>

      <div>
        <h2 className="font-bold">Submitted Answers:</h2>
        {props.result ? (
          <div>
            {props.result.answers.map((answer, i) => {
              return (
                <div key={answer.player_answer_id}>
                  <span className="font-semibold">#{i + 1} - </span>
                  {answer.content} -{" "}
                  {answer.is_correct ? "Correct!" : "Incorrect!"}
                </div>
              );
            })}
          </div>
        ) : (
          "No submitted answers."
        )}
      </div>
    </div>
  );
}

async function getQuiz(quizId: string): Promise<ApiResponse<Quiz>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result: ApiResponse<Quiz> = await response.json();

  return result;
}

type QuizUser = {
  user_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
};

async function getPlayers(quizId: string): Promise<ApiResponse<QuizUser[]>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/users`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result: ApiResponse<QuizUser[]> = await response.json();

  return result;
}

async function getResults(quizId: string): Promise<ApiResponse<QuizResult[]>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/results`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result: ApiResponse<QuizResult[]> = await response.json();

  return result;
}

function startQuiz(socket: WebSocketHook, data: QuizStartRequest): void {
  const message: WebSocketRequest<QuizStartRequest> = {
    event: WebSocketEvent.QuizStart,
    data: {
      quiz_id: data.quiz_id,
      status: data.status,
      quiz_question_id: data.quiz_question_id,
    },
  };

  socket.sendJsonMessage(message);
}

function changeQuestion(
  socket: WebSocketHook,
  data: QuizChangeQuestionRequest,
): void {
  const message: WebSocketRequest<QuizChangeQuestionRequest> = {
    event: WebSocketEvent.QuizChangeQuestion,
    data,
  };

  socket.sendJsonMessage(message);
}

// NOTE: This could be a global component

type QueryErrorProps = {
  message: string;
};

function QueryError(props: QueryErrorProps): JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{props.message}</AlertDescription>
    </Alert>
  );
}
