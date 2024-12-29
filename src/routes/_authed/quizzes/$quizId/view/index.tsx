import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	WebSocketEvent,
	WebSocketRequest,
	WebSocketResponse
} from "@/lib/websocket/types";
import {
	CreateWrittenAnswerRequest,
	QuizQuestion,
	QuizResult,
	QuizStatus,
	QuizUpdatePlayersQuestionRequest,
	QuizUpdateStatusRequest
} from "@/lib/quiz/types";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createContext, JSX, useState } from "react";
import { Player } from "./-components/player";
import { User, UserRole } from "@/lib/user/types";
import {
	quizCurrentQuestionQueryOptions,
	quizPlayersQueryOptions,
	quizQueryOptions
} from "@/lib/quiz/query";
import { ErrorAlert } from "@/components/error-alert";

export const Route = createFileRoute("/_authed/quizzes/$quizId/view/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session === null) {
			throw redirect({ to: "/login" });
		}

		if (session.user.role !== UserRole.Admin) {
			throw redirect({ to: "/" });
		}
	},
	loader: ({ context, params }) => {
		const quiz = context.queryClient.ensureQueryData(
			quizQueryOptions(params.quizId)
		);
		const players = context.queryClient.ensureQueryData(
			quizPlayersQueryOptions(params.quizId)
		);
		const currentQuestion = context.queryClient.ensureQueryData(
			quizCurrentQuestionQueryOptions(params.quizId)
		);

		return {
			quiz,
			players,
			currentQuestion
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

// NOTE:
// This is where admin will view all the current participants
// Admin can see the players' current answers in real-time
// Admin can move to the next/previous question

function RouteComponent(): JSX.Element {
	const params = Route.useParams();
	const quizQuery = useSuspenseQuery(quizQueryOptions(params.quizId));
	const playersQuery = useSuspenseQuery(quizPlayersQueryOptions(params.quizId));
	const currentQuestionQuery = useSuspenseQuery(
		quizCurrentQuestionQueryOptions(params.quizId)
	);

	const quiz = quizQuery.data.data;
	const players = playersQuery.data.data;
	const currentQuestion = currentQuestionQuery.data.data;

	const [quizQuestion, setQuizQuestion] =
		useState<QuizQuestion>(currentQuestion);

	const socket = useWebSocket(WEBSOCKET_URL, {
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.PlayerJoin:
					{
						const player = result.data as User;

						// TODO: Add `player` to players[]
					}
					break;
				case WebSocketEvent.QuizUpdateStatus:
					{
						const status = result.data as QuizStatus;

						// TODO: Do something with the new status
					}
					break;
				case WebSocketEvent.QuizStart:
					{
						const firstQuestion = result.data as QuizQuestion;

						// TODO: Update the current question

						toast.info("Good luck!");
					}
					break;

				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizQuestion;

						// TODO: Update the current question

						toast.info("Next question!");
					}

					break;

				case WebSocketEvent.PlayerTypeAnswer:
					{
						const answer = result.data as CreateWrittenAnswerRequest;

						// TODO: Update player's current answer
					}
					break;

				case WebSocketEvent.PlayerSubmitAnswer:
					{
						const answer = result.data as CreateWrittenAnswerRequest;

						// TODO: Update player's answer history
					}
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		},
		...WEBSOCKET_OPTIONS
	});

	const maxScore = quiz.questions.reduce((prev, acc) => prev + acc.points, 0);

	return (
		<div className="flex h-full flex-col">
			<div className="flex h-full flex-col items-center bg-card">
				<div className="max-w-7xl px-10 py-10">
					<div className="flex flex-col items-center justify-center gap-2 bg-card">
						<h1 className="text-center font-['metropolis-bold'] text-3xl">
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
						<h2 className="my-2 font-['metropolis-bold'] text-2xl">
							Questions
						</h2>

						<RadioGroup
							className="grid-cols-2 lg:grid-cols-4"
							defaultValue={
								currentQuestion
									? currentQuestion.quiz_question_id
									: quiz.questions[0].quiz_question_id
							}
							value={
								currentQuestion
									? currentQuestion.quiz_question_id
									: quiz.questions[0].quiz_question_id
							}
						>
							{quiz.questions.map((question) => {
								return (
									<label
										className="relative flex h-28 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-input bg-background/50 px-3 py-2 text-center shadow-sm shadow-black/5 ring-offset-background transition-colors has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-background has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/70 has-[:focus-visible]:ring-offset-2"
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
				<h2 className="my-2 font-['metropolis-bold'] text-2xl">Players</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-3">
					{players.map((player) => {
						return <div>{player.name}</div>;
					})}
				</div>
			</div>
		</div>
	);
}

function updateQuizStatus(
	socket: WebSocketHook,
	data: QuizUpdateStatusRequest
): void {
	const message: WebSocketRequest<QuizUpdateStatusRequest> = {
		event: WebSocketEvent.QuizUpdateStatus,
		data: data
	};

	socket.sendJsonMessage(message);
}

function startQuiz(socket: WebSocketHook, quizId: string) {
	const message: WebSocketRequest<string> = {
		event: WebSocketEvent.QuizStart,
		data: quizId
	};

	socket.sendJsonMessage(message);
}

function updatePlayersQuestion(
	socket: WebSocketHook,
	data: QuizUpdatePlayersQuestionRequest
): void {
	const message: WebSocketRequest<QuizUpdatePlayersQuestionRequest> = {
		event: WebSocketEvent.QuizUpdateQuestion,
		data
	};

	socket.sendJsonMessage(message);
}
