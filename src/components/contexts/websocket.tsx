import { BACKEND_HOST, BACKEND_PORT } from "astro:env/client";
import { createContext, useEffect, useState } from "react";

type Props = {
  children?: JSX.Element;
};

export const WebSocketContext = createContext<WebSocket | null>(null);

export function WebSocketProvider(props: Props): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    console.log("WebSocket provider.");
    const ws = new WebSocket(`ws://${BACKEND_HOST}:${BACKEND_PORT}/ws`);

    setSocket(ws);

    //return () => socket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {props.children}
    </WebSocketContext.Provider>
  );
}
