import { CreateWrittenAnswerRequest } from "@/lib/quiz/types";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

export function typeAnswer(
	socket: WebSocketHook,
	data: CreateWrittenAnswerRequest
): void {
	const message: WebSocketRequest<CreateWrittenAnswerRequest> = {
		event: WebSocketEvent.PlayerTypeAnswer,
		data
	};

	socket.sendJsonMessage(message);
}

export function submitAnswer(
	socket: WebSocketHook,
	data: CreateWrittenAnswerRequest
): void {
	const message: WebSocketRequest<CreateWrittenAnswerRequest> = {
		event: WebSocketEvent.PlayerSubmitAnswer,
		data: data
	};

	socket.sendJsonMessage(message);
}
