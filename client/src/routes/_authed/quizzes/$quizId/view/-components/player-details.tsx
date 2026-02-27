import { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quiz } from "@/lib/quiz";
import { IconCheck, IconClose } from "@/lib/icons";
import { Player } from "@/lib/quiz/player";

type Props = {
	player: Player;
	quiz: Quiz;
};

// NOTE: Not used

export function PlayerDetails(props: Props): JSX.Element {
	return (
		<div className="space-y-10">
			<div className="flex gap-2">
				<Avatar className="size-20">
					<AvatarImage src={props.player.user.avatarUrl} />
					<AvatarFallback className="font-metropolis-medium text-4xl text-foreground">
						{props.player.user.name[0]}
					</AvatarFallback>
				</Avatar>

				<div className="w-full">
					<p>{props.player.user.name}</p>

					<p>{props.player.result.currentAnswer || "No answer yet."}</p>
				</div>

				<div className="content-center space-x-1">
					<span className="font-metropolis-bold text-4xl">
						{props.player.result.score}
					</span>
					<span className="font-metropolis-bold text-lg">pts.</span>
				</div>
			</div>

			<div className="space-y-2">
				{props.player.result.answers.map((answer, i) => {
					const question = props.quiz.questions.find(
						(question) => question.quizQuestionId === answer.quizQuestionId
					);

					return (
						<div
							className="flex flex-col gap-2 rounded border bg-card px-3 py-2"
							key={answer.playerAnswerId}
						>
							<div className="flex items-center gap-1">
								{answer.isCorrect ? (
									<IconCheck className="text-success" />
								) : (
									<IconClose className="text-destructive" />
								)}
								<div className="size-10 content-center text-center">
									<span className="font-metropolis-semibold text-xl">
										{i + 1}
									</span>
								</div>
								<div>
									<p className="line-clamp-1 text-sm text-muted-foreground">
										{question ? question.content : "Invalid question."}
									</p>
									<p>{answer.content}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
