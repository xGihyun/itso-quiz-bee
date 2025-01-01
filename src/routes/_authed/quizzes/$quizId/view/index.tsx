import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import {
	CreateWrittenAnswerRequest,
	PlayerResult,
	QuizQuestion,
	QuizStatus
} from "@/lib/quiz/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { PlayIcon } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { JSX, useState } from "react";
import { Player } from "./-components/player";
import { User, UserRole } from "@/lib/user/types";
import {
	playerResultsQueryOptions,
	quizCurrentQuestionQueryOptions,
	quizQueryOptions
} from "@/lib/quiz/query";
import { ErrorAlert } from "@/components/error-alert";
import { ApiResponseStatus } from "@/lib/api/types";
import {
	startQuiz,
	updatePlayersQuestion,
	updateQuizStatus
} from "./-functions/websocket";
import { updatePlayerAnswer, updatePlayerResult } from "./-functions/helper";

export const Route = createFileRoute("/_authed/quizzes/$quizId/view/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.session.user.role !== UserRole.Admin) {
			throw redirect({ to: "/" });
		}
	},
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(quizQueryOptions(params.quizId)),
			context.queryClient.ensureQueryData(
				playerResultsQueryOptions(params.quizId)
			),
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId)
			)
		]);

		queries.forEach((query) => {
			if (query.status !== ApiResponseStatus.Success) {
				throw new Error(query.message);
			}
		});

		const [quizQuery, playerResultsQuery, currentQuestionQuery] = queries;

		return {
			quiz: quizQuery.data,
			players: playerResultsQuery.data,
			currentQuestion: currentQuestionQuery.data
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

// NOTE:
// This is where admin will view all the current participants.
// Admin can see the players' current answers in real-time.
// Admin can move to the next/previous question.

function RouteComponent(): JSX.Element {
	const params = Route.useParams();
	const loaderData = Route.useLoaderData();

	const [quiz, setQuiz] = useState(loaderData.quiz);
	const [players, setPlayers] = useState(loaderData.players);
	const [currentQuestion, setCurrentQuestion] = useState(
		loaderData.currentQuestion
	);

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
								answers: [],
								score: 0
							}
						]);
					}
					break;
				case WebSocketEvent.QuizUpdateStatus:
					{
						const status = result.data as QuizStatus;
						setQuiz({ ...quiz, status });
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
						const newPlayerResult = result.data as PlayerResult;
						const results = updatePlayerResult(players, newPlayerResult);
						setPlayers(results);
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	const maxScore = quiz.questions.reduce((prev, acc) => prev + acc.points, 0);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-full flex-col items-center bg-card">
				<div className="max-w-7xl px-10 py-10">
					<div className="flex flex-col items-center justify-center gap-2 bg-card">
						<h1 className="text-center font-metropolis-bold text-3xl">
							13th ITSO Quiz Bee
						</h1>
						<div className="flex gap-2">
							<Button
								onClick={() => {
									startQuiz(socket, params.quizId);
								}}
								disabled={
									socket.readyState !== ReadyState.OPEN ||
									quiz.status === QuizStatus.Started
								}
							>
								<PlayIcon size={16} strokeWidth={2} />
								Start
							</Button>

							<Button
								onClick={() => {
									updateQuizStatus(socket, {
										quiz_id: params.quizId,
										status: QuizStatus.Open
									});
								}}
								disabled={
									socket.readyState !== ReadyState.OPEN ||
									quiz.status === QuizStatus.Open
								}
							>
								Open
							</Button>
						</div>
					</div>

					<div>
						<h2 className="my-2 font-metropolis-bold text-2xl">Questions</h2>

						<RadioGroup
							className="grid-cols-2 lg:grid-cols-4"
							value={currentQuestion.quiz_question_id}
						>
							{quiz.questions.map((question) => {
								return (
									<label
										className="relative flex h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-input bg-background/50 px-3 py-2 text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
										key={question.quiz_question_id}
									>
										<span className="absolute left-3 top-2 text-sm">
											{question.order_number}
										</span>
										<RadioGroupItem
											id={question.quiz_question_id}
											value={question.quiz_question_id}
											className="sr-only after:absolute after:inset-0"
											onClick={() =>
												updatePlayersQuestion(socket, {
													...question,
													quiz_id: params.quizId
												})
											}
											disabled={socket.readyState !== ReadyState.OPEN}
										/>
										<p>{question.content}</p>
									</label>
								);
							})}
						</RadioGroup>
					</div>
				</div>
			</div>

			<div className="mx-auto flex h-full w-full max-w-7xl flex-col px-20 py-10">
				<h2 className="my-2 font-metropolis-bold text-2xl">Players</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3">
					{players.map((player) => {
						return <Player player={player} quizMaxScore={maxScore} />;
					})}
				</div>
			</div>
		</div>
	);
}
