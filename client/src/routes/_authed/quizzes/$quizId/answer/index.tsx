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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Wait } from "@/routes/_authed/-components/wait";

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

		const [quizQuery, currentQuestionQuery, playerQuery, playersQuery] =
			queries;

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
		description: "Switching to another tab or window pauses your quiz attempt."
	},
	[FocusViolationReason.WindowBlur]: {
		title: "Quiz window inactive",
		description: "Click directly on the quiz window to keep answering."
	},
	[FocusViolationReason.RestrictedKey]: {
		title: "Shortcuts disabled",
		description:
			"System shortcuts like Alt+Tab are blocked while the quiz is running."
	}
};

// Change the signature to accept a number (timestamp in ms)
const computeRemainingSeconds = (targetTimeMs: number): number => {
	return Math.max(0, Math.ceil((targetTimeMs - Date.now()) / 1000));
};

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const params = Route.useParams();
	const auth = useAuth();
	const queryClient = useQueryClient();
	const player = useQuery(
		playerQueryOptions(params.quizId, auth.user?.userId!)
	);

	const initialQuestion = loaderData.currentQuestion ?? null;
	const initialInterval = initialQuestion?.interval ?? null;

	// If loading from fresh page, we must trust server time.
	// If logic permits, you could assume full duration on refresh,
	// but server time is safer for mid-quiz refreshes.
	const initialTargetTime = initialInterval
		? new Date(initialInterval.endAt).getTime()
		: Date.now() + (initialQuestion?.question.duration ?? 0) * 1000;

	const initialDuration = initialQuestion?.question.duration ?? 0;
	// const initialRemainingTime = initialInterval
	// 	? computeRemainingSeconds(initialInterval)
	// 	: initialDuration;

	const [currentQuestion, setCurrentQuestion] =
		useState<QuizCurrentQuestion | null>(initialQuestion);
	// Initialize remaining time using the helper with the number
	const [remainingTime, setRemainingTime] = useState(
		initialInterval
			? computeRemainingSeconds(initialTargetTime)
			: (initialQuestion?.question.duration ?? 0)
	);
	const [timerInterval, setTimerInterval] = useState<Interval | null>(
		initialInterval
	);
	const [timerDuration, setTimerDuration] = useState(initialDuration);
	const [isTimerExpired, setIsTimerExpired] = useState(remainingTime <= 0);
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

	// 2. Update startCountdown to accept a specific Target Timestamp (ms)
	const startCountdown = useCallback((targetTimeMs: number) => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		setIsTimerExpired(false);

		const tick = (): void => {
			// Use the passed targetTimeMs, ignoring server clock skew
			const next = computeRemainingSeconds(targetTimeMs);
			setRemainingTime(next);

			console.log("tick");

			if (next <= 0) {
				if (intervalRef.current) clearInterval(intervalRef.current);
				intervalRef.current = null;
				console.log("TIME IS UP ON TICK");
				// setIsTimerExpired(true);
			}
		};

		tick();
		intervalRef.current = window.setInterval(tick, 1000);
	}, []);

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		queryParams: {
			token: auth.sessionToken
		},
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			console.log(result);

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

					// --- THE FIX IS HERE ---
					// Instead of trusting question.interval.endAt (which might be in the past due to clock skew),
					// we calculate a LOCAL end time: Now + Duration.
					const durationMs = question.question.duration * 1000;
					const localTargetTime = Date.now() + durationMs;

					// Start the countdown using our synchronized local time
					startCountdown(localTargetTime);

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

					// 1. Calculate the total duration of the timer from the server's data
					const startMs = new Date(interval.startAt).getTime();
					const endMs = new Date(interval.endAt).getTime();
					const durationMs = endMs - startMs;

					// 2. Create a local target time relative to right NOW
					// This ignores whether the server clock is ahead or behind yours
					const localTargetTime = Date.now() + durationMs;

					// 3. Start the countdown with the local timestamp
					startCountdown(localTargetTime);

					// Optional: Keep this if you need the raw data for other UI parts,
					// but don't use it for the countdown logic anymore.
					setTimerInterval(interval);

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

	// const startCountdown = useCallback((interval: Interval | null) => {
	// 	if (intervalRef.current) {
	// 		clearInterval(intervalRef.current);
	// 		intervalRef.current = null;
	// 	}
	//
	// 	if (!interval) {
	// 		return;
	// 	}
	//
	// 	setIsTimerExpired(false);
	//
	// 	const tick = (): void => {
	// 		const next = computeRemainingSeconds(interval);
	// 		setRemainingTime(next);
	//
	// 		if (next <= 0 && intervalRef.current) {
	// 			clearInterval(intervalRef.current);
	// 			intervalRef.current = null;
	// 			setIsTimerExpired(true);
	// 		}
	// 	};
	//
	// 	tick();
	// 	intervalRef.current = window.setInterval(tick, 1000);
	// }, []);

	// 4. Handle initial load countdown
	useEffect(() => {
		if (initialInterval) {
			// On page load, we have to trust the server time (or calculate an offset)
			startCountdown(new Date(initialInterval.endAt).getTime());
		}
	}, []); // Empty dependency array to run once on mount

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

	const isStatusLocked =
		statusLockCopy !== null && quizStatus !== QuizStatus.Started;
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
								key={currentQuestion.question.quizQuestionId}
								question={currentQuestion}
								player={player.data!.data}
								socket={socket}
								isTimerDone={isTimerExpired}
								isInteractionLocked={isInteractionLocked}
							/>
						</div>
					</div>
				</div>
			) : null}

			{showStatusOverlay && statusLockCopy ? (
				<div className="absolute inset-0 z-[550] flex flex-col items-center justify-center bg-background px-6 text-center">
					{quizStatus === QuizStatus.Open ? (
						<Wait />
					) : (
						<>
							<p className="font-metropolis-bold text-3xl">
								{statusLockCopy.title}
							</p>
							<p className="mt-4 max-w-2xl text-lg text-muted-foreground">
								{statusLockCopy.description}
							</p>
						</>
					)}
				</div>
			) : null}

			{isFocusLocked && focusReason ? (
				<div className="absolute inset-0 z-[600] flex flex-col items-center justify-center bg-background/95 px-6 text-center">
					<p className="font-metropolis-bold text-3xl">
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
