import { Button } from "@/components/ui/button";
import { WebSocketEvent, WebSocketRequest } from "@/lib/types/ws";
import { createFileRoute } from "@tanstack/react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { QuizStatus, UpdateQuizStatusRequest } from "../-types";
import { toast } from "sonner";
import { SOCKET_URL } from "@/lib/server";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: RouteComponent,
});

// NOTE: This is like the waiting room before the quiz starts

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const navigate = Route.useNavigate();
  const socket = useWebSocket(SOCKET_URL, {
    onOpen: () => {
      console.log("WebSocket opened.");
    },
    onMessage: async (event) => {
      const result: WebSocketRequest = await JSON.parse(event.data);
      console.log(result);

      switch (result.event) {
        case WebSocketEvent.QuizStart:
          await navigate({ to: "answer" });
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

  return <div></div>;
}
