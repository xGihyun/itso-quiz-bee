import {
	QuizUpdatePlayersQuestionRequest,
	QuizUpdateStatusRequest,
} from "@/lib/quiz/types";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";

export function updateQuizStatus(
	socket: WebSocketHook,
	data: QuizUpdateStatusRequest,
): void {
	const message: WebSocketRequest<QuizUpdateStatusRequest> = {
		event: WebSocketEvent.QuizUpdateStatus,
		data: data,
	};

	socket.sendJsonMessage(message);
}

export function updatePlayersQuestion(
	socket: WebSocketHook,
	data: QuizUpdatePlayersQuestionRequest,
): void {
	const message: WebSocketRequest<QuizUpdatePlayersQuestionRequest> = {
		event: WebSocketEvent.QuizUpdateQuestion,
		data,
	};

	socket.sendJsonMessage(message);
}

export function showLeaderboard(socket: WebSocketHook, data: boolean): void {
	const message: WebSocketRequest<boolean> = {
		event: WebSocketEvent.QuizShowLeaderboard,
		data,
	};

	socket.sendJsonMessage(message);
}
