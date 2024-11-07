// NOTE: Testing only!

import { WebSocketContext } from "@/components/contexts/websocket";
import { useContext } from "react";

export function Test(): JSX.Element {
  //const socket = useContext(WebSocketContext)
  console.log("I am test!")

  return <div>Child!</div>;
}
