import { createFileRoute, redirect } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import {
	CreateWrittenAnswerRequest,
	QuizQuestion,
	QuizQuestionTimer,
	QuizStatus,
} from "@/lib/quiz/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { JSX, useState } from "react";
import { User, UserRole } from "@/lib/user/types";
import {
	playersQueryOptions,
	quizCurrentQuestionQueryOptions,
	quizQueryOptions,
} from "@/lib/quiz/query";
import { ErrorAlert } from "@/components/error-alert";
import { ApiResponseStatus } from "@/lib/api/types";
import { updatePlayer, updatePlayerAnswer } from "./-functions/helper";
import { Player } from "@/lib/quiz/player/types";
import { QuizViewSchema } from "./-schemas";
import { PlayerListItem } from "./-components/player-list-item";
import { QuestionListItem } from "./-components/question-list-item";
import { Controls } from "./-components/controls";
import { QuestionActive } from "./-components/question-active";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PlayerFullscreen } from "./-components/player-fullscreen";
import { updatePlayersQuestion } from "./-functions/websocket";
import { Progress } from "@/components/ui/progress";

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
			context.queryClient.ensureQueryData(quizQueryOptions(params.quizId)),
			context.queryClient.ensureQueryData(playersQueryOptions(params.quizId)),
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId),
			),
		]);

		queries.forEach((query) => {
			if (query.status === ApiResponseStatus.Error) {
				throw new Error(query.message);
			}
		});

		const [quizQuery, playersQuery, currentQuestionQuery] = queries;

		return {
			quiz: quizQuery.data,
			players: playersQuery.data,
			currentQuestion: currentQuestionQuery.data,
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const search = Route.useSearch();

	const [quiz, setQuiz] = useState(loaderData.quiz);
	const [players, setPlayers] = useState(loaderData.players);
	const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
		loaderData.currentQuestion,
	);
	const [remainingTime, setRemainingTime] = useState(0);

	const selectedPlayer = players.find((p) => p.user_id === search.playerId);

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.PlayerJoin:
					{
						const newPlayer = result.data as User;

						if (players.some((p) => p.user_id === newPlayer.user_id)) {
							return;
						}

						setPlayers([
							...players,
							{
								...newPlayer,
								result: {
									answers: [],
									score: 0,
								},
							},
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
				case WebSocketEvent.QuizStart:
					{
						const firstQuestion = result.data as QuizQuestion;
						setCurrentQuestion(firstQuestion);
						setQuiz({ ...quiz, status: QuizStatus.Started });
					}
					break;

				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizQuestion;
						setCurrentQuestion(question);
						toast.info("Next question!");
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

				case WebSocketEvent.TimerPass:
					{
						const questionTimer = result.data as QuizQuestionTimer;

						setRemainingTime(questionTimer.remaining_time);
					}
					break;

				case WebSocketEvent.TimerDone:
					{
						if (currentQuestion === null) {
							return;
						}

						const nextQuestion = quiz.questions.find(
							(question) =>
								question.order_number === currentQuestion.order_number + 1,
						);

						if (!nextQuestion) {
							console.log("No more questions.");
							return;
						}

						updatePlayersQuestion(socket, {
							...nextQuestion,
							quiz_id: quiz.quiz_id,
						});
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		},
	});

	const focusedPlayerIndex = players.findIndex(
		(player) => player.user_id === search.playerId,
	);
	const focusedPlayer = players[focusedPlayerIndex];

	return (
		<div className="relative h-full pb-16">
            <Progress value={remainingTime} max={currentQuestion?.duration} className="rounded-none" />

			{focusedPlayerIndex !== -1 ? (
				<PlayerFullscreen
					player={focusedPlayer}
					question={currentQuestion}
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
										isActive={selectedPlayer?.user_id === player.user_id}
										rank={i + 1}
										question={currentQuestion}
										key={player.user_id}
									/>
								);
							})}
						</section>
					</ResizablePanel>

					<ResizableHandle withHandle />

					<ResizablePanel minSize={20}>
						<ResizablePanelGroup direction="vertical" className="gap-3">
							<ResizablePanel minSize={10}>
								{currentQuestion ? (
									<QuestionActive question={currentQuestion} />
								) : null}
							</ResizablePanel>

							<ResizableHandle withHandle />

							<ResizablePanel minSize={10}>
								<div className="space-y-2 overflow-y-scroll h-full">
									{quiz.questions.map((question) => (
										<QuestionListItem
											question={question}
											isActive={
												currentQuestion?.quiz_question_id ===
												question.quiz_question_id
											}
											key={question.quiz_question_id}
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
