import { Options } from "react-use-websocket";
import { WebSocketEvent, WebSocketRequest } from "./types";

export const WEBSOCKET_OPTIONS: Options = {
  onOpen: () => {
    console.log("WebSocket opened.");
  },
  onClose: () => {
    console.log("WebSocket connection is closing...");
  },
  shouldReconnect: (_) => true,
  heartbeat: {
    message: () => {
      const data: WebSocketRequest = {
        event: WebSocketEvent.Heartbeat,
        data: "Heartbeat!",
      };

      return JSON.stringify(data);
    },
    timeout: 60000,
    interval: 25000,
  },
  reconnectAttempts: 10,
};

export const WEBSOCKET_URL = `ws://192.168.1.2:3002/ws`;
