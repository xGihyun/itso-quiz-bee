import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { navigate } from "astro/virtual-modules/transitions-router.js";

enum EventType {
  Message = "message",
  NextQuestion = "next-question",
}

// NOTE: Testing only!

type WebSocketEvent = {
  event: EventType;
  data: any;
};

type Props = {
  children?: JSX.Element;
};

export function WebSocketTest(props: Props): JSX.Element {
  console.log("I am client!");

  socket.onopen = () => {
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

  return (
    <div>
      <Button onClick={() => navigate("/login")}>Navigate</Button>
      <Button onClick={sendMessage}>Send message!</Button>
      <Button onClick={nextQuestion}>Next Question!</Button>

      <div>{props.children}</div>
    </div>
  );
}

function sendMessage() {
  const msg: WebSocketEvent = {
    data: "I am from the client! (´｡• ᵕ •｡`)",
    event: EventType.Message,
  };

  socket.send(JSON.stringify(msg));
}

function nextQuestion() {
  const msg: WebSocketEvent = {
    data: {
      question_id: "Insert question ID",
      // ... other details here
    },
    event: EventType.Message,
  };

  socket.send(JSON.stringify(msg));
}
