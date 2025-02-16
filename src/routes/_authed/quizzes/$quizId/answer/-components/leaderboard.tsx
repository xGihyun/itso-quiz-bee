import { Player } from "@/lib/quiz/player/types";
import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
	players: Player[];
};

export function Leaderboard(props: Props): JSX.Element {
	return (
		<div className="space-y-10 overflow-y-auto w-full absolute inset-0 z-[500] bg-background px-20 py-10">
			<h1 className="text-center font-metropolis-bold text-4xl">Leaderboard</h1>

			<div className="flex flex-col gap-2 overflow-y-auto max-w-5xl mx-auto">
				{props.players.map((player, i) => {
					return (
						<PlayerLeaderboardItem
							player={player}
							rank={i + 1}
							key={player.user_id}
						/>
					);
				})}
			</div>
		</div>
	);
}

type PlayerLeaderboardItemProps = {
	player: Player;
	rank: number;
};

function PlayerLeaderboardItem(props: PlayerLeaderboardItemProps): JSX.Element {
	const initials = props.player.name[0];

	return (
		<div className="flex gap-4 rounded border px-4 py-3 bg-card">
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
				</div>
			</div>

			<div className="content-center space-x-0.5">
				<span className="font-metropolis-bold text-lg">
					{props.player.result.score}
				</span>
				<span className="font-metropolis-bold text-sm">pts.</span>
			</div>
		</div>
	);
}
