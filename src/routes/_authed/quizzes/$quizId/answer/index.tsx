import { createFileRoute } from "@tanstack/react-router";
import {
	WebSocketEvent,
	WebSocketRequest,
	WebSocketResponse
} from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizStatus, quizQueryOptions } from "@/lib/quiz";
import { Button } from "@/components/ui/button";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
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
	FocusViolationReason,
	JoinQuizRequest,
	PlayerFocusViolation,
	playerQueryOptions,
	playersQueryOptions
} from "@/lib/quiz/player";
import { Interval } from "@/lib/quiz/timer";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authed/quizzes/$quizId/answer/")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(quizQueryOptions(params.quizId)),
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId)
			),
			context.queryClient.ensureQueryData(
				playerQueryOptions(params.quizId, context.session.user.userId)
			),
			context.queryClient.ensureQueryData(playersQueryOptions(params.quizId))
		]);

		const [quizQuery, currentQuestionQuery, playerQuery, playersQuery] = queries;

		return {
			quiz: quizQuery.data,
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

const VIOLATION_DUPLICATE_WINDOW_MS = 400;

const focusReasonCopy: Record<
	FocusViolationReason,
	{ title: string; description: string }
> = {
	[FocusViolationReason.VisibilityChange]: {
		title: "Stay in this tab",
		description:
			"Switching to another tab or window pauses your quiz attempt."
	},
	[FocusViolationReason.WindowBlur]: {
		title: "Quiz window inactive",
		description:
			"Click directly on the quiz window to keep answering."
	},
	[FocusViolationReason.RestrictedKey]: {
		title: "Shortcuts disabled",
		description:
			"System shortcuts like Alt+Tab are blocked while the quiz is running."
	}
};

const computeRemainingSeconds = (interval: Interval): number => {
	const endAt = new Date(interval.endAt).getTime();
	return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
};

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const params = Route.useParams();
	const auth = useAuth();
	const queryClient = useQueryClient();

	const initialQuestion = loaderData.currentQuestion ?? null;
	const initialInterval = initialQuestion?.interval ?? null;
	const initialDuration = initialQuestion?.question.duration ?? 0;
	const initialRemainingTime = initialInterval
		? computeRemainingSeconds(initialInterval)
		: initialDuration;

	const [currentQuestion, setCurrentQuestion] = useState<
		QuizCurrentQuestion | null
	>(initialQuestion);
	const [remainingTime, setRemainingTime] = useState(initialRemainingTime);
	const [timerInterval, setTimerInterval] = useState<Interval | null>(
		initialInterval
	);
	const [timerDuration, setTimerDuration] = useState(initialDuration);
	const [isTimerExpired, setIsTimerExpired] = useState(
		initialDuration > 0 && initialRemainingTime <= 0
	);
	const [isLeaderboardShown, setIsLeaderboardShown] = useState(false);
	const [quizStatus, setQuizStatus] = useState<QuizStatus>(
		loaderData.quiz.status
	);
	const [isFocusLocked, setIsFocusLocked] = useState(false);
	const [focusReason, setFocusReason] = useState<FocusViolationReason | null>(
		null
	);
	const [focusViolationCount, setFocusViolationCount] = useState(0);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const lastViolationAtRef = useRef(0);
	const focusViolationCountRef = useRef(0);
	const hasJoinedRef = useRef(false);

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		queryParams: {
			token: auth.sessionToken
		},
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateStatus: {
					const status = result.data as QuizStatus;
					setQuizStatus(status);
					toast.info(`Quiz is ${status}.`);
					break;
				}
				case WebSocketEvent.QuizUpdateQuestion: {
					const question = result.data as QuizCurrentQuestion;
					setCurrentQuestion(question);
					setTimerDuration(question.question.duration);
					setRemainingTime(question.question.duration);
					setTimerInterval(null);
					setIsTimerExpired(false);
					setIsLeaderboardShown(false);
					toast.info("Next question!");
					break;
				}
				case WebSocketEvent.QuizShowLeaderboard: {
					const isShown = result.data as boolean;
					setIsLeaderboardShown(isShown);
					break;
				}
				case WebSocketEvent.PlayerSubmitAnswer: {
					toast.info("Submitted answer!");
					break;
				}
				case WebSocketEvent.TimerStart: {
					const interval = result.data as Interval;
					setTimerInterval(interval);
					setRemainingTime(computeRemainingSeconds(interval));
					setIsTimerExpired(false);
					break;
				}
				case WebSocketEvent.TimerDone: {
					setTimerInterval(null);
					setIsTimerExpired(true);
					setRemainingTime(0);
					toast.info("Time is up!");
					break;
				}
				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	const startCountdown = useCallback((interval: Interval | null) => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (!interval) {
			return;
		}

		setIsTimerExpired(false);

		const tick = (): void => {
			const next = computeRemainingSeconds(interval);
			setRemainingTime(next);

			if (next <= 0 && intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
				setIsTimerExpired(true);
			}
		};

		tick();
		intervalRef.current = window.setInterval(tick, 1000);
	}, []);

	useEffect(() => {
		startCountdown(timerInterval);
	}, [startCountdown, timerInterval]);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (!auth.user || !socket.sendJsonMessage || hasJoinedRef.current) {
			return;
		}

		hasJoinedRef.current = true;

		const message: WebSocketRequest<JoinQuizRequest> = {
			event: WebSocketEvent.PlayerJoin,
			data: { quizId: params.quizId, userId: auth.user.userId }
		};

		socket.sendJsonMessage(message);

		queryClient.invalidateQueries({
			queryKey: quizCurrentQuestionQueryOptions(params.quizId).queryKey
		});
	}, [auth.user, params.quizId, queryClient, socket.sendJsonMessage]);

	const reportFocusViolation = useCallback(
		(reason: FocusViolationReason) => {
			if (!auth.user || !socket.sendJsonMessage) {
				return;
			}

			const now = Date.now();
			if (now - lastViolationAtRef.current < VIOLATION_DUPLICATE_WINDOW_MS) {
				return;
			}

			lastViolationAtRef.current = now;
			focusViolationCountRef.current += 1;
			const attempt = focusViolationCountRef.current;

			setFocusViolationCount(attempt);
			setFocusReason(reason);
			setIsFocusLocked(true);

			const payload: PlayerFocusViolation = {
				quizId: params.quizId,
				userId: auth.user.userId,
				reason,
				occurredAt: new Date().toISOString(),
				attempt
			};

			const message: WebSocketRequest<PlayerFocusViolation> = {
				event: WebSocketEvent.PlayerFocusWarning,
				data: payload
			};

			socket.sendJsonMessage(message);

			const copy = focusReasonCopy[reason];
			toast.error(copy.title, { description: copy.description });
		},
		[auth.user, params.quizId, socket.sendJsonMessage]
	);

	useEffect(() => {
		if (!auth.user) {
			return;
		}

		const handleVisibilityChange = (): void => {
			if (document.hidden) {
				reportFocusViolation(FocusViolationReason.VisibilityChange);
			}
		};

		const handleBlur = (): void => {
			if (document.hidden) {
				return;
			}

			reportFocusViolation(FocusViolationReason.WindowBlur);
		};

		const handleKeydown = (event: KeyboardEvent): void => {
			if (event.altKey && (event.key === "Tab" || event.key === "F4")) {
				event.preventDefault();
				reportFocusViolation(FocusViolationReason.RestrictedKey);
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("blur", handleBlur);
		window.addEventListener("keydown", handleKeydown);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("blur", handleBlur);
			window.removeEventListener("keydown", handleKeydown);
		};
	}, [auth.user, reportFocusViolation]);

	const statusLockCopy = (() => {
		switch (quizStatus) {
			case QuizStatus.Open:
				return {
					title: "Waiting for the host",
					description: "Stay on this tab until the quiz officially starts."
				};
			case QuizStatus.Paused:
				return {
					title: "Quiz paused",
					description: "Answering is temporarily disabled by the admin."
				};
			case QuizStatus.Closed:
				return {
					title: "Quiz finished",
					description: "Thanks for playing! You can wait for the final results."
				};
			default:
				return null;
		}
	})();

	const isStatusLocked = statusLockCopy !== null && quizStatus !== QuizStatus.Started;
	const showStatusOverlay = isStatusLocked;
	const isInteractionLocked = isFocusLocked || isStatusLocked;

	const handleFocusResume = (): void => {
		setIsFocusLocked(false);
		setFocusReason(null);
	};

	return (
		<div className="relative flex h-full flex-col">
			{isLeaderboardShown ? <Leaderboard players={loaderData.players} /> : null}

			{currentQuestion ? (
				<div>
					<Progress
						value={remainingTime}
						max={Math.max(1, timerDuration || 1)}
						className="rounded-none"
					/>

					<div className="flex h-full items-center bg-card px-20 py-10">
						<p className="mx-auto mb-5 max-w-5xl text-center font-metropolis-bold text-3xl">
							{currentQuestion.question.content}
						</p>
					</div>

					<div className="mx-auto flex h-full w-full px-20 py-10">
						<div className="mx-auto w-full max-w-5xl">
							<WrittenAnswerForm
								question={currentQuestion}
								player={loaderData.player}
								socket={socket}
								isTimerDone={isTimerExpired}
								isInteractionLocked={isInteractionLocked}
							/>
						</div>
					</div>
				</div>
			) : null}

			{showStatusOverlay && statusLockCopy ? (
				<div className="absolute inset-0 z-[550] flex flex-col items-center justify-center bg-background/95 px-6 text-center">
					<p className="text-3xl font-metropolis-bold">
						{statusLockCopy.title}
					</p>
					<p className="mt-4 max-w-2xl text-lg text-muted-foreground">
						{statusLockCopy.description}
					</p>
				</div>
			) : null}

			{isFocusLocked && focusReason ? (
				<div className="absolute inset-0 z-[600] flex flex-col items-center justify-center bg-background/95 px-6 text-center">
					<p className="text-3xl font-metropolis-bold">
						{focusReasonCopy[focusReason].title}
					</p>
					<p className="mt-4 max-w-2xl text-lg text-muted-foreground">
						{focusReasonCopy[focusReason].description}
					</p>
					<p className="mt-6 text-sm text-muted-foreground">
						Attempt #{focusViolationCount}
					</p>
					<Button className="mt-8" onClick={handleFocusResume}>
						I'm ready to continue
					</Button>
				</div>
			) : null}
		</div>
	);
}
