import { Options } from "react-use-websocket";

export const WEBSOCKET_OPTIONS: Options = {
  onOpen: () => {
    console.log("WebSocket opened.");
  },
  onClose: () => {
    console.log("WebSocket connection is closing...");
  },
  shouldReconnect: (_) => true,
  //heartbeat: {
  //  message: "Ping!",
  //  returnMessage: "Pong!",
  //  timeout: 60000,
  //  interval: 25000,
  //},
};

export const WEBSOCKET_URL = `ws://localhost:3002/ws`;
