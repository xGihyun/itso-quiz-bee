import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  QuizNextQuestionRequest,
  QuizStartRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/types/ws";
import { Quiz, QuizStatus, UpdateQuizStatusRequest } from "../../-types";
import { SOCKET_URL } from "@/lib/server";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/lib/types/api";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    queryFn: () => getQuiz(params.quizId),
  });

  const socket = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      console.log("WebSocket opened.");
    },
    onMessage: async (event) => {
      const result: WebSocketRequest = await JSON.parse(event.data);
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizStart:
          //await navigate({ to: "answer" });
          toast.info("Quiz has started!");
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    onClose: () => {
      console.log("WebSocket connection is closing...");
    },
    //heartbeat: {
    //  message: "Ping!",
    //  returnMessage: "Pong!",
    //  timeout: 60000,
    //  interval: 25000,
    //},
  });

  const [questionIndex, setQuestionIndex] = useState(0);

  function startQuiz(): void {
    const question = query.data?.data.questions[questionIndex];

    if (!question) {
      console.error("Question not found at index:", questionIndex);
      return;
    }

    console.log(question);

    const data: WebSocketRequest<QuizStartRequest> = {
      event: WebSocketEvent.QuizStart,
      data: {
        quiz_id: params.quizId,
        status: QuizStatus.Started,
        quiz_question_id: question.quiz_question_id,
      },
    };
    socket.sendJsonMessage(data);
  }

  function nextQuestion(): void {
    if(questionIndex > query.data?.data?.questions?.length - 1) {
      console.warn("No more next question!")
      return
    }

    const question = query.data?.data.questions[questionIndex + 1];

    if (!question) {
      console.error("Question not found at index:", questionIndex);
      return;
    }

    console.log("Current:", questionIndex);

    setQuestionIndex(count => count += 1)

    console.log("New:", questionIndex);

    const data: WebSocketRequest<QuizNextQuestionRequest> = {
      event: WebSocketEvent.QuizNextQuestion,
      data: {
        quiz_question_id: question.quiz_question_id,
        quiz_id: params.quizId
      },
    };

    socket.sendJsonMessage(data);
  }


  function previousQuestion(): void {
    if(questionIndex < 1) {
      console.warn("No more previous question!")
      return
    }

    const question = query.data?.data.questions[questionIndex - 1];

    if (!question) {
      console.error("Question not found at index:", questionIndex);
      return;
    }

    console.log("Current:", questionIndex);

    setQuestionIndex(count => count += 1)

    console.log("New:", questionIndex);

    const data: WebSocketRequest<QuizNextQuestionRequest> = {
      event: WebSocketEvent.QuizNextQuestion,
      data: {
        quiz_question_id: question.quiz_question_id,
        quiz_id: params.quizId
      },
    };

    socket.sendJsonMessage(data);
  }

  if (query.isPending) {
    return <Skeleton className="w-20 h-20" />;
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{query.data?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      <Button
        onClick={startQuiz}
        disabled={socket.readyState !== ReadyState.OPEN}
      >
        Start
      </Button>

      <Button
        onClick={previousQuestion}
        disabled={socket.readyState !== ReadyState.OPEN}
      >
        Previous Question
      </Button>


      <Button
        onClick={nextQuestion}
        disabled={socket.readyState !== ReadyState.OPEN}
      >
        Next Question
      </Button>

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

  console.log(result)

  return result;
}
