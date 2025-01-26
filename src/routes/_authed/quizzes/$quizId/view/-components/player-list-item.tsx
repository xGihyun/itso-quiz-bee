import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { JSX } from "react";
import { Player } from "@/lib/quiz/player/types";
import { QuizQuestion } from "@/lib/quiz/types";
import { IconPen } from "@/lib/icons";

type Props = {
	player: Player;
	isActive: boolean;
	rank: number;
	question: QuizQuestion | null;
};

export function PlayerListItem(props: Props): JSX.Element {
	const initials = props.player.name[0];
	const playerAnswer = props.player.result.answers.find(
		(answer) => answer.quiz_question_id === props.question?.quiz_question_id,
	);

	return (
		<Link
			className="flex gap-4 rounded border px-4 py-3 bg-card"
			to="."
			search={(prev) => ({ ...prev, playerId: props.player.user_id })}
			key={props.player.user_id}
		>
			<div className="content-center font-metropolis-bold text-lg">
				#{props.rank}
			</div>

			<div className="flex w-full items-center gap-2">
				<Avatar className="size-12">
					<AvatarImage src={props.player.avatar_url} />
					<AvatarFallback className="text-foreground">
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className="w-full">
					<p>{props.player.name}</p>

					<div className="flex items-center gap-1">
						<IconPen
							className={`size-4 ${
								playerAnswer
									? playerAnswer.is_correct
										? "text-success"
										: "text-destructive"
									: "text-muted-foreground"
							}
                            `}
						/>
						<p
							className={`font-metropolis-semibold ${
								playerAnswer ? "text-foreground" : "text-muted-foreground"
							}`}
						>
							{playerAnswer?.content ||
								props.player.result.currentAnswer ||
								"No answer."}
						</p>
					</div>
				</div>
			</div>

			<div className="content-center space-x-0.5">
				<span className="font-metropolis-bold text-lg">
					{props.player.result.score}
				</span>
				<span className="font-metropolis-bold text-sm">pts.</span>
			</div>
		</Link>
	);
}
