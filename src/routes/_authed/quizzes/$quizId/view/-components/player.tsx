import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	PlayerResult,
} from "@/lib/quiz/types";
import {
	CheckCircleIcon,
	PenLineIcon,
	TrophyIcon,
	UserIcon,
	XCircleIcon
} from "lucide-react";
import { JSX } from "react";

type Props = {
	player: PlayerResult;
    quizMaxScore: number
};

export function Player(props: Props): JSX.Element {
	return (
		<Card
			className="cursor-pointer"
		>
			<CardHeader>
				<CardTitle className="flex flex-row items-center gap-2">
					<UserIcon size={24} />
					<p className="font-metropolis-medium">
						{props.player.name}
					</p>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex items-center gap-2">
					<TrophyIcon size={16} />
					{props.player.score} / {props.quizMaxScore}
				</div>

				<div className="relative">
					<Input
						className="rounded-b-none rounded-t border-b-2 border-b-secondary/50 bg-muted ps-9 read-only:bg-muted/50"
						value={props.player.currentAnswer}
						placeholder="No answer."
						readOnly
					/>
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
						<PenLineIcon size={16} strokeWidth={2} aria-hidden="true" />
					</div>
				</div>

				<div>
					<h2 className="mb-2 flex items-center gap-2 font-medium">
						<CheckCircleIcon size={16} />
						Submitted Answers
					</h2>

					{props.player.answers.length > 0 ? (
						<ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-4">
							{props.player.answers.map((answer, i) => (
								<div
									key={answer.player_answer_id}
									className="mb-2 flex items-center space-x-2"
								>
									<Badge className="mt-1">#{i + 1}</Badge>

									<div className="flex items-center gap-2">
										<p>{answer.content}</p>

										{answer.is_correct ? (
											<CheckCircleIcon
												size={16}
												strokeWidth={2}
												className="text-success"
											/>
										) : (
											<XCircleIcon
												size={16}
												strokeWidth={2}
												className="text-destructive"
											/>
										)}
									</div>
								</div>
							))}
						</ScrollArea>
					) : (
						<p className="text-muted-foreground">No submitted answers yet.</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
