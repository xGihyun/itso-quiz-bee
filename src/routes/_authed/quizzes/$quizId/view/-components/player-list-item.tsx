import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { JSX } from "react";
import { Player } from "@/lib/quiz/player/types";

type Props = {
	player: Player;
	isActive: boolean;
	rank: number;
};

export function PlayerListItem(props: Props): JSX.Element {
	const initials = props.player.name[0];

	return (
		<Link
			className={`flex gap-4 rounded border px-4 py-3 ${props.isActive ? "bg-primary text-primary-foreground" : "bg-card"}`}
			to="."
			search={(prev) => ({ ...prev, playerId: props.player.user_id })}
			key={props.player.user_id}
			disabled
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

					<p
						className={`font-metropolis-semibold ${
							props.player.result.currentAnswer
								? "text-foreground"
								: `${props.isActive ? "text-primary-foreground" : "text-muted-foreground"}`
						}`}
					>
						{props.player.result.currentAnswer || "No answer yet."}
					</p>
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
