import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { CreateWrittenAnswerRequest, QuizQuestion } from "@/lib/quiz/types";
import { JSX, useEffect, useRef, useState } from "react";
import { quizCurrentQuestionQueryOptions } from "@/lib/quiz/query";
import { ApiResponseStatus } from "@/lib/api/types";
import { ErrorAlert } from "@/components/error-alert";
import { WrittenAnswerForm } from "./-components/written-form";
import gsap from "gsap";

export const Route = createFileRoute("/_authed/quizzes/$quizId/answer/")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const queries = await Promise.all([
			context.queryClient.ensureQueryData(
				quizCurrentQuestionQueryOptions(params.quizId)
			)
		]);

		queries.forEach((query) => {
			if (query.status !== ApiResponseStatus.Success) {
				throw new Error(query.message);
			}
		});

		const [currentQuestionQuery] = queries;

		return {
			currentQuestion: currentQuestionQuery.data,
			user: context.session.user
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

// TODO: Prevent answer resubmission

function RouteComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();

	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [currentQuestion, setCurrentQuestion] = useState(
		loaderData.currentQuestion
	);

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

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	const containerElement = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.fromTo(
			containerElement.current,
			{
				scale: 0,
				opacity: 0
			},
			{
				scale: 1,
				opacity: 1
			}
		);
	}, []);

	return (
		<div ref={containerElement} className="flex h-full flex-col">
			<div className="flex h-full items-center px-20 py-10">
				<p className="mx-auto mb-5 max-w-5xl text-center font-['metropolis-bold'] text-3xl">
					{currentQuestion.content}
				</p>
			</div>

			<div className="mx-auto flex h-full w-full bg-card px-20 py-10">
				<div className="mx-auto w-full max-w-5xl">
					<WrittenAnswerForm
						question={currentQuestion}
						user={loaderData.user}
					/>
				</div>
			</div>
		</div>
	);
}
