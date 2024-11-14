import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketRequest } from "@/lib/types/ws";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { SOCKET_URL } from "@/lib/server";
import { useEffect, useState } from "react";
import { QuizQuestion } from "../../-types";
import { ApiResponse } from "@/lib/types/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/quizzes/$quizId/answer/")({
  component: RouteComponent,
});

// NOTE:
// This is where the players would answer the quiz
// Redirect here once admin starts the quiz

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const query = useQuery({
    queryKey: ["current-question"],
    queryFn: () => getCurrentQuestion(params.quizId),
  });
  const socket = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      console.log("WebSocket opened.");
    },
    onMessage: async (event) => {
      const result: WebSocketRequest<QuizQuestion> = await JSON.parse(
        event.data,
      );
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizNextQuestion:
        case WebSocketEvent.QuizPreviousQuestion:
          query.refetch();

          toast.info("Next question!");
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    onClose: () => {
      console.log("WebSocket connection is closing...");
    },
    heartbeat: {
      message: "Ping!",
      returnMessage: "Pong!",
      timeout: 60000,
      interval: 5000,
    },
    shouldReconnect: () => true
  });

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
      <div>Quiz Answer Here!</div>

      <h1>{query.data.data?.content}</h1>
    </div>
  );
}

async function getCurrentQuestion(
  quizId: string,
): Promise<ApiResponse<QuizQuestion>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}/questions/current`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const result: ApiResponse<QuizQuestion> = await response.json();

  console.log(result);

  return result;
}
