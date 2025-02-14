import {
	QuizUpdatePlayersQuestionRequest,
	QuizUpdateStatusRequest,
	UpdateTimerModeRequest,
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

export function startQuiz(socket: WebSocketHook, quizId: string) {
	const message: WebSocketRequest<string> = {
		event: WebSocketEvent.QuizStart,
		data: quizId,
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

export function updateTimerMode(
	socket: WebSocketHook,
	data: UpdateTimerModeRequest,
) {
	const message: WebSocketRequest<UpdateTimerModeRequest> = {
		event: WebSocketEvent.TimerUpdateMode,
		data: data,
	};

	socket.sendJsonMessage(message);
}
