import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { JSX } from "react";
import { QuizQuestion } from "@/lib/quiz";
import { IconPen } from "@/lib/icons";
import {
	FocusViolationReason,
	Player,
	PlayerFocusViolation
} from "@/lib/quiz/player";

type Props = {
	player: Player;
	isActive: boolean;
	rank: number;
	question?: QuizQuestion;
	violation?: PlayerFocusViolation;
};

const violationLabel: Record<FocusViolationReason, string> = {
	[FocusViolationReason.VisibilityChange]: "Tab switch detected",
	[FocusViolationReason.WindowBlur]: "Window inactive",
	[FocusViolationReason.RestrictedKey]: "Shortcut attempt"
};

export function PlayerListItem(props: Props): JSX.Element {
	const initials = props.player.user.name[0];
	const playerAnswer = props.player.result.answers.find(
		(answer) => answer.quizQuestionId === props.question?.quizQuestionId
	);
	const violationText = props.violation
		? violationLabel[props.violation.reason]
		: null;

	return (
		<Link
			className={`flex gap-4 rounded border bg-card px-4 py-3 ${props.violation ? "border-destructive/70" : ""}`}
			to="."
			search={(prev) => ({ ...prev, playerId: props.player.user.userId })}
			key={props.player.user.userId}
		>
			<div className="content-center font-metropolis-bold text-lg">
				#{props.rank}
			</div>

			<div className="flex w-full items-center gap-2">
				<Avatar className="size-12">
					<AvatarImage src={props.player.user.avatarUrl} />
					<AvatarFallback className="text-foreground">
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className="w-full">
					<p>{props.player.user.name}</p>

					<div className="flex items-center gap-1">
						<IconPen
							className={`size-4 ${
								playerAnswer
									? playerAnswer.isCorrect
										? "text-success"
										: "text-destructive"
									: "text-muted-foreground"
							} `}
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

			<div className="flex flex-col items-end justify-center gap-2">
				{props.violation && violationText ? (
					<Badge variant="destructive" className="whitespace-nowrap">
						{violationText} · #{props.violation.attempt}
					</Badge>
				) : null}
				<div className="content-center space-x-0.5">
					<span className="font-metropolis-bold text-lg">
						{props.player.result.score}
					</span>
					<span className="font-metropolis-bold text-sm">pts.</span>
				</div>
			</div>
		</Link>
	);
}
