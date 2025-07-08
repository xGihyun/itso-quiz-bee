import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { JSX, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quiz, QuizQuestion } from "@/lib/quiz";
import { gsap } from "gsap";
import { IconPen } from "@/lib/icons";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable";
import { Player } from "@/lib/quiz/player";

type Props = {
	player: Player;
	question?: QuizQuestion;
	quiz: Quiz;
	rank: number;
};

export function PlayerFullscreen(props: Props): JSX.Element {
	const initials = props.player.user.name[0];
	const playerAnswer = props.player.result.answers.find(
		(answer) => answer.quizQuestionId === props.question?.quizQuestionId
	);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.fromTo(
			containerRef.current,
			{
				opacity: 0,
				ease: "power3.out"
			},
			{
				opacity: 1,
				ease: "power3.out"
			}
		);
	}, []);

	return (
		<div
			className="fixed inset-0 z-[999] flex h-full w-full flex-col bg-background p-10"
			ref={containerRef}
		>
			<Link
				className="absolute right-2 top-2 rounded p-2 text-muted-foreground hover:bg-muted"
				to="."
			>
				<X className="size-4" />
			</Link>

			<ResizablePanelGroup direction="horizontal" className="h-full gap-3">
				<ResizablePanel minSize={20}>
					<section className="h-full content-center space-y-10">
						<div className="space-y-2">
							<Avatar className="mx-auto size-40">
								<AvatarImage src={props.player.user.avatarUrl} />
								<AvatarFallback className="text-6xl text-foreground">
									{initials}
								</AvatarFallback>
							</Avatar>

							<p className="text-center font-metropolis-bold text-3xl">
								{props.player.user.name}
							</p>
						</div>

						<div className="grid grid-cols-2">
							<div className="flex flex-col items-center">
								<span>Rank</span>
								<span className="font-metropolis-bold text-3xl">
									#{props.rank}
								</span>
							</div>

							<div className="flex flex-col items-center">
								<span>Score</span>
								<div className="content-center space-x-0.5 text-center">
									<span className="font-metropolis-bold text-3xl">
										{props.player.result.score}
									</span>
									<span className="font-metropolis-bold text-xl">pts.</span>
								</div>
							</div>
						</div>
					</section>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel minSize={20}>
					<ResizablePanelGroup direction="vertical" className="gap-3">
						<ResizablePanel minSize={10}>
							{props.question ? (
								<CurrentQuestion
									question={props.question}
									currentAnswer={props.player.result.currentAnswer}
								/>
							) : null}
						</ResizablePanel>

						<ResizableHandle withHandle />

						<ResizablePanel minSize={10} className="space-y-2">
							<h1 className="font-metropolis-bold text-xl">Answers</h1>

							<AnswerHistory {...props} />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

type CurrentQuestionProps = {
	question: QuizQuestion;
	currentAnswer?: string;
};

function CurrentQuestion(props: CurrentQuestionProps): JSX.Element {
	return (
		<div className="h-full content-center space-y-4 overflow-auto rounded border bg-card p-6">
			<p className="text-center text-base">{props.question.content}</p>

			<div className="flex items-center justify-center gap-1">
				<IconPen className="size-7 text-primary" />
				<p
					className={`font-metropolis-bold text-xl ${props.currentAnswer ? "text-foreground" : "text-muted-foreground"}`}
				>
					{props.currentAnswer || "No answer."}
				</p>
			</div>
		</div>
	);
}

function AnswerHistory(props: Props): JSX.Element {
	return (
		<div className="h-full space-y-2 overflow-y-scroll">
			{props.player.result.answers.map((answer) => {
				const question = props.quiz.questions.find(
					(question) => question.quizQuestionId === answer.quizQuestionId
				);

				return (
					<div
						className="flex w-full gap-4 rounded border bg-card px-4 py-3 text-start"
						key={answer.playerAnswerId}
					>
						<div className="content-center font-metropolis-bold text-lg">
							{question?.orderNumber}
						</div>

						<div className="flex w-full flex-col">
							<div className="flex w-full justify-between">
								<p>{question?.content}</p>

								<div className="space-x-1">
									<span className="font-metropolis-bold text-base">
										{question?.points}
									</span>
									<span className="font-metropolis-bold text-sm">pts.</span>
								</div>
							</div>

							<p
								className={`font-metropolis-semibold ${answer.isCorrect ? "text-success" : "text-destructive"} `}
							>
								{answer.content}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
