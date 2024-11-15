import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  QuizChangeQuestionRequest,
  QuizStartRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/websocket/types";
import { Quiz, QuizStatus } from "@/lib/quiz/types";
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

export const Route = createFileRoute("/quizzes/$quizId/view/")({
  component: RouteComponent,
});

// NOTE:
// This is where admin will view all the current participants
// Admin can see the players' current answers in real-time
// Admin can move to the next/previous question

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const query = useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      const quiz = await getQuiz(params.quizId);
      const currentQuestion = await getCurrentQuestion(params.quizId);

      return {
        quiz,
        currentQuestion,
      };
    },
  });

  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketRequest = await JSON.parse(event.data);
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizStart:
          toast.info("Quiz has started!");
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    ...WEBSOCKET_OPTIONS,
  });

  if (query.isPending) {
    return <Skeleton className="w-20 h-20" />;
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{query.data?.quiz.message}</AlertDescription>
      </Alert>
    );
  }

  const quiz = query.data.quiz.data;
  const currentQuestion = query.data.currentQuestion.data;

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

      <RadioGroup
        className="grid-cols-4"
        defaultValue={
          currentQuestion.quiz_question_id || quiz.questions[0].quiz_question_id
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
                    quiz_question_id: question.quiz_question_id,
                  })
                }
                disabled={socket.readyState !== ReadyState.OPEN}
              />
              <p>{question.content}</p>
            </label>
          );
        })}
      </RadioGroup>

      <div>Display current question and answers here.</div>

      <div>Display the players with their answers here.</div>
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
    data: {
      quiz_question_id: data.quiz_question_id,
      quiz_id: data.quiz_id,
    },
  };

  socket.sendJsonMessage(message);
}
