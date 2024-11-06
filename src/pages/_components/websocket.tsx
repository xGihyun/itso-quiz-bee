import { Button } from "@/components/ui/button";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { BACKEND_HOST, BACKEND_PORT } from "astro:env/client";

enum EventType {
  Message = "message",
  NextQuestion = "next-question",
}

// NOTE: Testing only!

type WebSocketEvent = {
  event: EventType;
  data: any;
};

export function WebSocketTest(): JSX.Element {
  const socket = new WebSocket(`ws://${BACKEND_HOST}:${BACKEND_PORT}/ws`);

  socket.onopen = (event) => {
    console.log("WebSocket is open!");
  };

  socket.onclose = (event) => {
    console.error("Websocket closed: ", event);
  };

  socket.onerror = (event) => {
    console.error("Something went wrong: ", event);
  };

  socket.onmessage = (event) => {
    console.log("Received: ", event);
  };

  const sendMessage = () => {
    const msg: WebSocketEvent = {
      data: "I am from the client! (´｡• ᵕ •｡`)",
      event: EventType.Message,
    };

    socket.send(JSON.stringify(msg));
  };

  const nextQuestion = () => {
    const msg: WebSocketEvent = {
      data: {
        question_id: "Insert question ID",
        // ... other details here
      },
      event: EventType.Message,
    };

    socket.send(JSON.stringify(msg));
  };

  return (
    <div>
      <Button onClick={() => navigate("/login")}>Navigate</Button>
      <Button onClick={sendMessage}>Send message!</Button>
      <Button onClick={nextQuestion}>Next Question!</Button>
    </div>
  );
}
