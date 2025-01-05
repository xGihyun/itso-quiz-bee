import { Player } from "@/lib/quiz/player/types";
import { CreateWrittenAnswerRequest } from "@/lib/quiz/types";

export function updatePlayerAnswer(
	players: Player[],
	currentAnswer: CreateWrittenAnswerRequest
): Player[] {
	const p = players.map((player) => {
		if (player.user_id !== currentAnswer.user_id) {
			return player;
		}

		player.result.currentAnswer = currentAnswer.content;

		return player;
	});

	return p;
}

export function updatePlayer(players: Player[], newResult: Player): Player[] {
	const p = players.map((player) => {
		if (player.user_id !== newResult.user_id) {
			return player;
		}

		player = newResult;

		return player;
	});

	return p;
}
