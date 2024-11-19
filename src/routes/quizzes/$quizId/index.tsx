import {
  QuizUpdateStatusRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/websocket/types";
import { createFileRoute } from "@tanstack/react-router";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizStatus } from "@/lib/quiz/types";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: RouteComponent,
});

// NOTE: This is like the waiting room before the quiz starts

function RouteComponent(): JSX.Element {
  const navigate = Route.useNavigate();
  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketRequest = await JSON.parse(event.data);
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizUpdateStatus:
          const data = result.data as QuizUpdateStatusRequest;
          if (data.status === QuizStatus.Started) {
            await navigate({ to: "answer" });
            toast.info("Quiz has started!");
          }
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    ...WEBSOCKET_OPTIONS,
  });

  return <div>Waiting room!</div>;
}
