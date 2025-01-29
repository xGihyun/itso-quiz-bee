import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { CreateWrittenAnswerRequest, QuizQuestion } from "@/lib/quiz/types";
import { JSX, useEffect, useRef, useState } from "react";
import {
	playerQueryOptions,
	quizCurrentQuestionQueryOptions,
} from "@/lib/quiz/query";
import { ApiResponseStatus } from "@/lib/api/types";
import { ErrorAlert } from "@/components/error-alert";
import { WrittenAnswerForm } from "./-components/written-form";
import { gsap } from "gsap";

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
		]);

		queries.forEach((query) => {
			if (query.status === ApiResponseStatus.Error) {
				throw new Error(query.message);
			}
		});

		const [currentQuestionQuery, playerQuery] = queries;

		return {
			currentQuestion: currentQuestionQuery.data,
			user: context.session.user,
			player: playerQuery.data,
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

	const _ = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateQuestion:
					{
						const question = result.data as QuizQuestion;
						setCurrentQuestion(question);
						toast.info("Next question!");
					}
					break;

				case WebSocketEvent.PlayerSubmitAnswer:
					{
						const currentAnswer = result.data as CreateWrittenAnswerRequest;
						//setHasSubmitted(true);
						toast.info("Submitted answer!");
					}
					break;
				case WebSocketEvent.QuizTimerPass:
					{
						const time = result.data.remaining_time as number;

						setRemainingTime(time);
						console.log("Timer pass.");
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
		<div className="flex h-full flex-col">
			<div className="flex h-full items-center bg-card px-20 py-10">
				Time: {remainingTime}
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
