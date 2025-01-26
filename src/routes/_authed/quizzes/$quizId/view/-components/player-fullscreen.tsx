import { Player } from "@/lib/quiz/player/types";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { JSX, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quiz, QuizQuestion } from "@/lib/quiz/types";
import { gsap } from "gsap";
import { IconPen } from "@/lib/icons";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

type Props = {
	player: Player;
	question: QuizQuestion | null;
	quiz: Quiz;
};

export function PlayerFullscreen(props: Props): JSX.Element {
	const initials = props.player.name[0];
	const playerAnswer = props.player.result.answers.find(
		(answer) => answer.quiz_question_id === props.question?.quiz_question_id,
	);

	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.fromTo(
			containerRef.current,
			{
				opacity: 0,
				ease: "power3.out",
			},
			{
				opacity: 1,
				ease: "power3.out",
			},
		);
	}, []);

	return (
		<div
			className="inset-0 fixed w-full h-full bg-background z-[999] p-4 flex flex-col"
			ref={containerRef}
		>
			<Link className="text-muted-foreground" to=".">
				<X className="size-4" />
			</Link>

			<ResizablePanelGroup direction="horizontal" className="gap-3 h-full">
				<ResizablePanel minSize={20}>
					<section className="content-center h-full">
						<div className="space-y-2">
							<Avatar className="size-40 mx-auto">
								<AvatarImage src={props.player.avatar_url} />
								<AvatarFallback className="text-foreground text-6xl">
									{initials}
								</AvatarFallback>
							</Avatar>

							<p className="font-metropolis-bold text-3xl text-center">
								{props.player.username}
							</p>
						</div>

						<div className="content-center space-x-0.5 text-center">
							<span className="font-metropolis-bold text-3xl">
								{props.player.result.score}
							</span>
							<span className="font-metropolis-bold text-xl">pts.</span>
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

							<div className="h-full space-y-2  overflow-y-scroll">
								{props.player.result.answers.map((answer) => {
									const question = props.quiz.questions.find(
										(question) =>
											question.quiz_question_id === answer.quiz_question_id,
									);

									return (
										<div
											className="flex gap-4 w-full rounded border px-4 py-3 text-start bg-card"
											key={answer.player_answer_id}
										>
											<div className="content-center font-metropolis-bold text-lg">
												{question?.order_number}
											</div>

											<div className="flex flex-col w-full">
												<div className="flex justify-between w-full">
													<p>{question?.content}</p>

													<div className="space-x-1">
														<span className="text-base font-metropolis-bold">
															{question?.points}
														</span>
														<span className="text-sm font-metropolis-bold">
															pts.
														</span>
													</div>
												</div>

												<p
													className={`font-metropolis-semibold ${answer.is_correct ? "text-success" : "text-destructive"} `}
												>
													{answer.content}
												</p>
											</div>
										</div>
									);
								})}
							</div>
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
		<div className="h-full content-center space-y-2 rounded border bg-card p-6 overflow-auto">
			<p className="text-center font-metropolis-bold text-2xl">
				{props.question.content}
			</p>

			<div className="flex items-center justify-center gap-1">
				<IconPen className="size-6 text-primary" />
				<p>{props.currentAnswer || "No answer."}</p>
			</div>
		</div>
	);
}
