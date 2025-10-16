import { createFileRoute, redirect } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import { quizQueryOptions, QuizQuestion, QuizStatus } from "@/lib/quiz";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { JSX, useEffect, useRef, useState } from "react";
import { ErrorAlert } from "@/components/error-alert";
import { updatePlayer, updatePlayerAnswer } from "./-functions/helper";
import { QuizViewSchema } from "./-schemas";
import { PlayerListItem } from "./-components/player-list-item";
import { QuestionListItem } from "./-components/question-list-item";
import { Controls } from "./-components/controls";
import { QuestionActive } from "./-components/question-active";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup
} from "@/components/ui/resizable";
import { PlayerFullscreen } from "./-components/player-fullscreen";
import { Progress } from "@/components/ui/progress";
import { User, UserRole } from "@/lib/user";
import {
	CreateWrittenAnswerRequest,
	Player,
	playersQueryOptions
} from "@/lib/quiz/player";
import {
	QuizCurrentQuestion,
	quizCurrentQuestionQueryOptions
} from "@/lib/quiz/question";
import { useAuth } from "@/auth";
import { Interval } from "@/lib/quiz/timer";
import { updatePlayersQuestion } from "./-functions/websocket";

export const Route = createFileRoute("/_authed/quizzes/$quizId/view/")({
	component: RouteComponent,
	validateSearch: QuizViewSchema,
	beforeLoad: async ({ context }) => {
		if (context.session.user.role !== UserRole.Admin) {
			throw redirect({ to: "/" });
		}
	},
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(
				quizQueryOptions(params.quizId, true)
			),
			context.queryClient.ensureQueryData(playersQueryOptions(params.quizId)),
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId)
			)
		]);

		const [quizQuery, playersQuery, currentQuestionQuery] = queries;

		return {
			quiz: quizQuery.data,
			players: playersQuery.data,
			currentQuestion: currentQuestionQuery.data
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const search = Route.useSearch();
	const auth = useAuth();
	const params = Route.useParams();

	const [quiz, setQuiz] = useState(loaderData.quiz);
	const [players, setPlayers] = useState(loaderData.players);
	const [currentQuestion, setCurrentQuestion] =
		useState<QuizCurrentQuestion | null>({
			...loaderData.currentQuestion,
			question: loaderData.quiz.questions.find(
				(v) =>
					v.quizQuestionId ===
					loaderData.currentQuestion.question.quizQuestionId
			)!
		});
	const [isLeaderboardShown, setIsLeaderboardShown] = useState(false);
	const [remainingTime, setRemainingTime] = useState(0);

	const selectedPlayer = players.find((p) => p.user.userId === search.playerId);
	const intervalRef = useRef<NodeJS.Timeout>(null);

	// Initialize timer on mount if there's an active question with interval
	useEffect(() => {
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
			}
		};
	}, [currentQuestion?.question.quizQuestionId]);

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		queryParams: {
			token: auth.sessionToken
		},
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);
			console.log(result);

			switch (result.event) {
				case WebSocketEvent.PlayerJoin:
					{
						const newPlayer = result.data as User;
						console.log("Joined:", newPlayer);

						if (players.some((p) => p.user.userId === newPlayer.userId)) {
							return;
						}

						setPlayers([
							...players,
							{
								user: newPlayer,
								result: {
									answers: [],
									score: 0
								}
							}
						]);
					}
					break;

				case WebSocketEvent.QuizUpdateStatus:
					{
						const status = result.data as QuizStatus;
						setQuiz({ ...quiz, status });
						toast.info("Quiz has " + status + ".");
					}
					break;

				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizCurrentQuestion;
						setCurrentQuestion({
							...question,
							question: loaderData.quiz.questions.find(
								(v) => v.quizQuestionId === question.question.quizQuestionId
							)!
						});
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

				case WebSocketEvent.PlayerTypeAnswer:
					{
						const currentAnswer = result.data as CreateWrittenAnswerRequest;
						const results = updatePlayerAnswer(players, currentAnswer);
						setPlayers(results);
					}
					break;

				case WebSocketEvent.PlayerSubmitAnswer:
					{
						const newPlayer = result.data as Player;
						const results = updatePlayer(players, newPlayer);
						setPlayers(results);
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

							if (remaining <= 0 && intervalRef.current) {
								clearInterval(intervalRef.current);
							}
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

						setPlayers((prev) =>
							[...prev].sort((a, b) => b.result.score - a.result.score)
						);
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	const focusedPlayerIndex = players.findIndex(
		(player) => player.user.userId === search.playerId
	);
	const focusedPlayer = players[focusedPlayerIndex];

	// Handler for question click
	const handleQuestionClick = (question: QuizQuestion) => {
		// Update local state immediately
		if (currentQuestion?.question.quizQuestionId !== question.quizQuestionId) {
			setCurrentQuestion({
				question: question
			});
		}

		// Only send WebSocket message if quiz is started (to trigger timer)
		if (quiz.status === QuizStatus.Started) {
			updatePlayersQuestion(socket, {
				...question,
				quizId: params.quizId
			});
		}
	};

	return (
		<div className="relative h-full pb-16">
			<Progress
				value={remainingTime}
				max={currentQuestion?.question.duration || 100}
				className="rounded-none"
			/>

			{focusedPlayerIndex !== -1 ? (
				<PlayerFullscreen
					player={focusedPlayer}
					question={currentQuestion?.question}
					quiz={quiz}
					rank={focusedPlayerIndex + 1}
				/>
			) : null}

			<div className="mx-auto h-full max-w-screen-2xl p-10">
				<ResizablePanelGroup direction="horizontal" className="gap-3">
					<ResizablePanel minSize={20}>
						<section className="flex h-full flex-col gap-2 overflow-y-auto">
							{players.map((player, i) => {
								return (
									<PlayerListItem
										player={player}
										isActive={
											selectedPlayer?.user.userId === player.user.userId
										}
										rank={i + 1}
										question={currentQuestion?.question}
										key={player.user.userId}
									/>
								);
							})}
						</section>
					</ResizablePanel>

					<ResizableHandle withHandle />

					<ResizablePanel minSize={20}>
						<ResizablePanelGroup direction="vertical" className="gap-3">
							<ResizablePanel minSize={10}>
								{currentQuestion?.question ? (
									<QuestionActive question={currentQuestion.question} />
								) : null}
							</ResizablePanel>

							<ResizableHandle withHandle />

							<ResizablePanel minSize={10}>
								<div className="h-full space-y-2 overflow-y-scroll">
									{quiz.questions.map((question) => (
										<QuestionListItem
											quiz={quiz}
											question={question}
											isActive={
												currentQuestion?.question.quizQuestionId ===
												question.quizQuestionId
											}
											onQuestionClick={handleQuestionClick}
											key={question.quizQuestionId}
										/>
									))}
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>

			<Controls quiz={quiz} />
		</div>
	);
}
