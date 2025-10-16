import { CreateWrittenAnswerRequest, Player } from "@/lib/quiz/player";

export function updatePlayerAnswer(
	players: Player[],
	currentAnswer: CreateWrittenAnswerRequest
): Player[] {
	const p = players.map((player) => {
		if (player.user.userId !== currentAnswer.userId) {
			return player;
		}

		player.result.currentAnswer = currentAnswer.content;

		return player;
	});

	return p;
}

export function updatePlayer(players: Player[], newResult: Player): Player[] {
	const p = players.map((player) => {
		if (player.user.userId !== newResult.user.userId) {
			return player;
		}

		player = newResult;

		return player;
	});

	return p;
}
