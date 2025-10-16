import { createFileRoute } from "@tanstack/react-router";
import {
	WebSocketEvent,
	WebSocketRequest,
	WebSocketResponse
} from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizQuestion } from "@/lib/quiz";
import { JSX, useEffect, useRef, useState } from "react";
import { ErrorAlert } from "@/components/error-alert";
import { WrittenAnswerForm } from "./-components/written-form";
import { Progress } from "@/components/ui/progress";
import { Leaderboard } from "./-components/leaderboard";
import { useAuth } from "@/auth";
import {
	QuizCurrentQuestion,
	quizCurrentQuestionQueryOptions
} from "@/lib/quiz/question";
import {
	CreateWrittenAnswerRequest,
	JoinQuizRequest,
	playerQueryOptions,
	playersQueryOptions
} from "@/lib/quiz/player";
import { Interval } from "@/lib/quiz/timer";

export const Route = createFileRoute("/_authed/quizzes/$quizId/answer/")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId)
			),
			context.queryClient.ensureQueryData(
				playerQueryOptions(params.quizId, context.session.user.userId)
			),
			context.queryClient.ensureQueryData(playersQueryOptions(params.quizId))
		]);

		const [currentQuestionQuery, playerQuery, playersQuery] = queries;

		return {
			currentQuestion: currentQuestionQuery.data,
			user: context.session.user,
			player: playerQuery.data,
			players: playersQuery.data
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

// TODO:
// - Persist submitted answer
// - Prevent answer resubmission

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const params = Route.useParams();
	const auth = useAuth();

	const [currentQuestion, setCurrentQuestion] = useState(
		loaderData.currentQuestion
	);
	const [remainingTime, setRemainingTime] = useState(0);
	const [isLeaderboardShown, setIsLeaderboardShown] = useState(false);

	const intervalRef = useRef<NodeJS.Timeout>(null);

	// Move the useWebSocket hook BEFORE the useEffect
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		queryParams: {
			token: auth.sessionToken
		},
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizCurrentQuestion;
						setCurrentQuestion(question);
						setRemainingTime(question.question.duration);
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

				case WebSocketEvent.TimerStart:
					{
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
						}
						const interval = result.data as Interval;
						console.log(interval);

						intervalRef.current = setInterval(() => {
							const now = new Date();
							const endAt = new Date(interval.endAt);
							const remaining = Math.max(
								0,
								Math.floor((endAt.getTime() - now.getTime()) / 1000) + 1
							);
							setRemainingTime(remaining);
							console.log(remaining);
						}, 1000);
					}
					break;

				case WebSocketEvent.TimerDone:
					{
						if (intervalRef.current) {
							clearInterval(intervalRef.current);
						}
						setRemainingTime(0);
						toast.info("Time is up!");
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	// Now add proper dependencies to useEffect
	useEffect(() => {
		console.log("useEffect running, auth.user:", auth.user);

		if (!auth.user || !socket.sendJsonMessage) {
			console.log("Skipping join - no user or socket not ready");
			return;
		}

		const message: WebSocketRequest<JoinQuizRequest> = {
			event: WebSocketEvent.PlayerJoin,
			data: { quizId: params.quizId, userId: auth.user.userId }
		};

		console.log("Sending player join message");
		socket.sendJsonMessage(message);

            console.log("Current Question:", currentQuestion)
		if (currentQuestion?.interval) {
			const now = new Date();
			const endAt = new Date(currentQuestion.interval.endAt);
			const remaining = Math.max(
				0,
				Math.floor((endAt.getTime() - now.getTime()) / 1000) + 1
			);

			setRemainingTime(remaining);

			// Start interval if time remaining
			if (remaining > 0) {
				intervalRef.current = setInterval(() => {
					const now = new Date();
					const endAt = new Date(currentQuestion.interval!.endAt);
					const remaining = Math.max(
						0,
						Math.floor((endAt.getTime() - now.getTime()) / 1000) + 1
					);

					setRemainingTime(remaining);

					if (remaining <= 0 && intervalRef.current) {
						clearInterval(intervalRef.current);
					}
				}, 1000);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				console.log("Unmounted interval");
			}
		};
	}, [auth.user, params.quizId, socket.sendJsonMessage]); // Add dependencies

	return (
		<div className="relative flex h-full flex-col">
			{isLeaderboardShown ? <Leaderboard players={loaderData.players} /> : null}

			{currentQuestion ? (
				<div>
					<Progress
						value={remainingTime}
						max={currentQuestion?.question.duration || 100}
						className="rounded-none"
					/>

					<div className="flex h-full items-center bg-card px-20 py-10">
						<p className="mx-auto mb-5 max-w-5xl text-center font-metropolis-bold text-3xl">
							{currentQuestion?.question.content}
						</p>
					</div>

					<div className="mx-auto flex h-full w-full px-20 py-10">
						<div className="mx-auto w-full max-w-5xl">
							<WrittenAnswerForm
								question={currentQuestion}
								player={loaderData.player}
								socket={socket}
							/>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
