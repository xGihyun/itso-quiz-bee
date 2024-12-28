import { WEBSOCKET_URL } from "@/lib/websocket/constants";
import { createContext } from "react";
import useWebSocket from "react-use-websocket";

const socket = useWebSocket(WEBSOCKET_URL);

const WebSocketContext = createContext(socket);
