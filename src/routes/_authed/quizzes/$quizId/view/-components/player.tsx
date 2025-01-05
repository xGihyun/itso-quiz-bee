import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@tanstack/react-router";
import { JSX } from "react";
import { Player } from "@/lib/quiz/player/types";
import { IconPen } from "@/lib/icons";

type Props = {
	player: Player;
	isActive: boolean;
};

export function PlayerListItem(props: Props): JSX.Element {
	return (
		<Link
			className={`flex space-x-2 rounded border px-3 py-2 ${props.isActive ? "bg-primary text-primary-foreground" : "bg-card"}`}
			to="."
			search={(prev) => ({ ...prev, playerId: props.player.user_id })}
			key={props.player.user_id}
		>
			<Avatar className="size-12">
				<AvatarImage src={props.player.avatar_url} />
				<AvatarFallback className="text-foreground">
					{props.player.name[0]}
				</AvatarFallback>
			</Avatar>

			<div className="w-full">
				<p>{props.player.name}</p>

				<div className="flex items-center gap-1">
					<IconPen />
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

			<div className="content-center space-x-1">
				<span className="font-metropolis-bold text-lg">
					{props.player.result.score}
				</span>
				<span className="font-metropolis-bold text-sm">pts.</span>
			</div>
		</Link>
	);
}
