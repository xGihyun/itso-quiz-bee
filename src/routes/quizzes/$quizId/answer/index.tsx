import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizQuestion, QuizQuestionVariant } from "@/lib/quiz/types";
import { getCurrentQuestion } from "@/lib/quiz/requests";
import { MultipleChoiceForm } from "./-components/multiple-choice-form";
import { WrittenAnswerForm } from "./-components/written-form";

export const Route = createFileRoute("/quizzes/$quizId/answer/")({
  component: RouteComponent,
});

// NOTE:
// This is where the players would answer the quiz
// Redirect here once admin starts the quiz

// TODO: 
// WebSocket connection closes when passing it as props to Form components
// Solution (?): Wrap components with socket context???

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const query = useQuery({
    queryKey: ["current-question"],
    queryFn: () => getCurrentQuestion(params.quizId),
  });
  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketRequest<QuizQuestion> = await JSON.parse(
        event.data,
      );
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizChangeQuestion:
          query.refetch();

          toast.info("Next question!");
          break;
        case WebSocketEvent.QuizSubmitAnswer:
          toast.info("Submitted answer!");
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
        <AlertDescription>{query.data?.message}</AlertDescription>
      </Alert>
    );
  }

  const question = query.data.data;

  return (
    <div>
      <div>Question #{question.order_number}</div>

      <button onClick={() => socket.sendJsonMessage({foo: "BAR"})}>
        SOCKET TEST
      </button>

      <h1 className="mb-5 font-bold text-3xl">{question.content}</h1>

      {question.variant === QuizQuestionVariant.Written ? (
        <WrittenAnswerForm
          socket={socket}
          question={question}
          quizId={params.quizId}
        />
      ) : (
        <MultipleChoiceForm
          socket={socket}
          question={question}
          quizId={params.quizId}
        />
      )}
    </div>
  );
}
