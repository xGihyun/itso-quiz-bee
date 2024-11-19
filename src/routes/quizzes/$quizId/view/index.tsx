import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  QuizChangeQuestionRequest,
  QuizStartRequest,
  QuizUpdateStatusRequest,
  WebSocketEvent,
  WebSocketRequest,
  WebSocketResponse,
} from "@/lib/websocket/types";
import {
  PlayerCurrentAnswer,
  Quiz,
  QuizQuestion,
  QuizQuestionVariant,
  QuizResult,
  QuizStatus,
  QuizUser,
} from "@/lib/quiz/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseStatus } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, PlayIcon } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCurrentQuestion } from "@/lib/quiz/requests";
import {
  MultipleChoiceInput,
  WrittenAnswerInput,
} from "../answer/-components/schema";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/server";
import { UserRole } from "@/lib/user/types";
import { Player } from "./-components/player";

export const Route = createFileRoute("/quizzes/$quizId/view/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const result = await getCurrentUser();

    if (result.status !== ApiResponseStatus.Success) {
      console.error(result.message);
      throw redirect({ to: "/" });
    }

    if (result.data.role !== UserRole.Admin) {
      console.error("Permission denied.");
      throw redirect({ to: "/" });
    }
  },
});

// NOTE:
// This is where admin will view all the current participants
// Admin can see the players' current answers in real-time
// Admin can move to the next/previous question

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
        case WebSocketEvent.QuizUpdateStatus:
          {
            const data = result.data as QuizUpdateStatusRequest;

            await quizQuery.refetch();

            switch (data.status) {
              case QuizStatus.Started:
                await currentQuestionQuery.refetch();
                toast.info("Quiz has started!");
                break;
              default:
                console.log("Quiz status updated:", data.status);
            }
          }
          break;

        case WebSocketEvent.QuizChangeQuestion:
          // NOTE: Probably not the best idea but it works
          await currentQuestionQuery.refetch();

          toast.info("Next question!");

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

  const maxScore = quiz.questions.reduce((prev, acc) => prev + acc.points, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="h-full flex flex-col items-center bg-card">
        <div className="px-10 py-10 max-w-7xl">
          <div className="flex justify-center flex-col items-center gap-2 bg-card">
            <h1 className="text-center font-['metropolis-bold'] text-3xl">
              13th ITSO Quiz Bee
            </h1>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  updateQuizStatus(socket, {
                    quiz_id: params.quizId,
                    quiz_question_id: quiz.questions[0].quiz_question_id,
                    status: QuizStatus.Started,
                  });
                }}
                disabled={
                  socket.readyState !== ReadyState.OPEN ||
                  quiz.status === QuizStatus.Started
                }
              >
                <PlayIcon size={16} strokeWidth={2} />
                Start
              </Button>

              <Button
                onClick={() => {
                  updateQuizStatus(socket, {
                    quiz_id: params.quizId,
                    status: QuizStatus.Open,
                  });
                }}
                disabled={
                  socket.readyState !== ReadyState.OPEN ||
                  quiz.status === QuizStatus.Open
                }
              >
                Open
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl my-2 font-['metropolis-bold']">
              Questions
            </h2>

            <RadioGroup
              className="grid-cols-2 lg:grid-cols-4"
              defaultValue={
                currentQuestion
                  ? currentQuestion.quiz_question_id
                  : quiz.questions[0].quiz_question_id
              }
              value={
                currentQuestion
                  ? currentQuestion.quiz_question_id
                  : quiz.questions[0].quiz_question_id
              }
            >
              {quiz.questions.map((question) => {
                return (
                  <label
                    className="relative h-28 flex cursor-pointer bg-background/50 flex-col items-center gap-3 rounded-lg border border-input px-3 py-2 justify-center text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
                    key={question.quiz_question_id}
                  >
                    <span className="absolute top-2 left-3 text-sm">
                      {question.order_number}
                    </span>
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
          </div>
        </div>
      </div>

      <div className=" px-20 py-10 h-full flex flex-col w-full max-w-7xl mx-auto">
        <h2 className="text-2xl my-2 font-['metropolis-bold']">Players</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => {
            const answer = playerAnswers.get(player.user_id);
            const result = quizResults.find(
              (result) => result.user_id === player.user_id,
            );

            return (
              <Player
                key={player.user_id}
                question={currentQuestion}
                maxScore={maxScore}
                player={player}
                answer={answer}
                result={result}
              />
            );
          })}
        </div>
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

function updateQuizStatus(
  socket: WebSocketHook,
  data: QuizUpdateStatusRequest,
): void {
  const message: WebSocketRequest<QuizUpdateStatusRequest> = {
    event: WebSocketEvent.QuizUpdateStatus,
    data: data,
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
