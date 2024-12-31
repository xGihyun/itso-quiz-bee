import { CreateWrittenAnswerRequest, PlayerResult } from "@/lib/quiz/types";

export function updatePlayerAnswer(
	players: PlayerResult[],
	currentAnswer: CreateWrittenAnswerRequest
): PlayerResult[] {
	const p = players.map((player) => {
		if (player.user_id !== currentAnswer.user_id) {
			return player;
		}

		player.currentAnswer = currentAnswer.content;

		return player;
	});

	return p;
}

export function updatePlayerResult(
	players: PlayerResult[],
	newResult: PlayerResult
): PlayerResult[] {
	const p = players.map((player) => {
		if (player.user_id !== newResult.user_id) {
			return player;
		}

		player = newResult;

		return player;
	});

	return p;
}
