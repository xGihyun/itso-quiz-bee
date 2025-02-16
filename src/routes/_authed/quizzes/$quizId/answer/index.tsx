import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import {
	CreateWrittenAnswerRequest,
	QuizQuestion,
} from "@/lib/quiz/types";
import { JSX, useEffect, useRef, useState } from "react";
import {
	playerQueryOptions,
	playersQueryOptions,
	quizCurrentQuestionQueryOptions,
} from "@/lib/quiz/query";
import { ApiResponseStatus } from "@/lib/api/types";
import { ErrorAlert } from "@/components/error-alert";
import { WrittenAnswerForm } from "./-components/written-form";
import { gsap } from "gsap";
import { Progress } from "@/components/ui/progress";
import { Leaderboard } from "./-components/leaderboard";

export const Route = createFileRoute("/_authed/quizzes/$quizId/answer/")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId),
			),
			context.queryClient.ensureQueryData(
				playerQueryOptions(params.quizId, context.session.user.user_id),
			),
			context.queryClient.ensureQueryData(playersQueryOptions(params.quizId)),
		]);

		queries.forEach((query) => {
			if (query.status === ApiResponseStatus.Error) {
				throw new Error(query.message);
			}
		});

		const [currentQuestionQuery, playerQuery, playersQuery] = queries;

		return {
			currentQuestion: currentQuestionQuery.data,
			user: context.session.user,
			player: playerQuery.data,
			players: playersQuery.data,
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>,
});

// TODO:
// - Persist submitted answer
// - Prevent answer resubmission

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();

	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(
		loaderData.currentQuestion,
	);
	const [remainingTime, setRemainingTime] = useState(0);
	const [isLeaderboardShown, setIsLeaderboardShown] = useState(false);

	const _ = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizQuestion;
						setCurrentQuestion(question);
						setRemainingTime(question.duration);
						toast.info("Next question!");
					}
					break;

				case WebSocketEvent.QuizShowLeaderboard:
					{
						const isShown = result.data as boolean;
						setIsLeaderboardShown(isShown);
					}
					break;

				case WebSocketEvent.PlayerSubmitAnswer:
					{
						// WARN: Players might see other players' answers
						const currentAnswer = result.data as CreateWrittenAnswerRequest;
						console.log(currentAnswer);
						toast.info("Submitted answer!");
					}
					break;

				case WebSocketEvent.TimerPass:
					{
						const remainingTime = result.data as number;
						setRemainingTime(remainingTime);
					}
					break;

				case WebSocketEvent.TimerDone:
					{
						toast.info("Time is up!");
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		},
	});

	const questionRef = useRef<HTMLParagraphElement>(null);

	useEffect(() => {
		gsap.fromTo(
			questionRef.current,
			{
				opacity: 0,
				ease: "power3.out",
			},
			{
				opacity: 1,
				ease: "power3.out",
			},
		);
	}, [currentQuestion]);

	return (
		<div className="flex h-full flex-col relative">
			{isLeaderboardShown ? <Leaderboard players={loaderData.players} /> : null}

			<Progress
				value={remainingTime}
				max={currentQuestion?.duration}
				className="rounded-none"
			/>

			<div className="flex h-full items-center bg-card px-20 py-10">
				<p
					className="mx-auto mb-5 max-w-5xl text-center font-metropolis-bold text-3xl"
					ref={questionRef}
				>
					{currentQuestion.content}
				</p>
			</div>

			<div className="mx-auto flex h-full w-full px-20 py-10">
				<div className="mx-auto w-full max-w-5xl">
					<WrittenAnswerForm
						question={currentQuestion}
						player={loaderData.player}
					/>
				</div>
			</div>
		</div>
	);
}
