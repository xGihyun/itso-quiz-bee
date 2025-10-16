import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { WrittenAnswerInput, WrittenAnswerSchema } from "./schema";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CheckIcon } from "lucide-react";
import { QuizQuestion } from "@/lib/quiz";
import { JSX, useState, useEffect } from "react";
import { submitAnswer, typeAnswer } from "../-functions/websocket";
import { useParams } from "@tanstack/react-router";
import { IconPen } from "@/lib/icons";
import { Player, PlayerAnswer } from "@/lib/quiz/player";
import { QuizCurrentQuestion } from "@/lib/quiz/question";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { toast } from "sonner";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { useAuth } from "@/auth";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";

type Props = {
	player: Player;
	question: QuizCurrentQuestion;
	socket: WebSocketHook; // Add socket as a prop
};

export function WrittenAnswerForm(props: Props): JSX.Element {
	const params = useParams({ from: "/_authed/quizzes/$quizId/answer/" });
	const form = useForm<WrittenAnswerInput>({
		resolver: zodResolver(WrittenAnswerSchema),
		defaultValues: {
			content: "",
			quizQuestionId: props.question.question.quizQuestionId
		}
	});
	const auth = useAuth();
	const [isTimerDone, setIsTimerDone] = useState(false);

	const [currentAnswer, setCurrentAnswer] = useState<
		WrittenAnswerInput | undefined
	>(
		props.player.result.answers.find(
			(answer) =>
				answer.quizQuestionId === props.question.question.quizQuestionId
		)
	);

	const _ = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		queryParams: {
			token: auth.sessionToken
		},
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.TimerStart:
					setIsTimerDone(false);
					break;
				case WebSocketEvent.TimerDone:
					setIsTimerDone(true);
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	// Update the form when the question changes
	useEffect(() => {
		const newCurrentAnswer = props.player.result.answers.find(
			(answer) =>
				answer.quizQuestionId === props.question.question.quizQuestionId
		);

		// if (!newCurrentAnswer) return;

		setCurrentAnswer(newCurrentAnswer);

		form.reset({
			content: newCurrentAnswer?.content ?? "",
			quizQuestionId: props.question.question.quizQuestionId
		});
	}, [props.question.question.quizQuestionId, props.player.result.answers]);

	async function onSubmit(value: WrittenAnswerInput): Promise<void> {
		submitAnswer(props.socket, {
			...value,
			userId: props.player.user.userId,
			quizId: params.quizId
		});

		setCurrentAnswer(value);

		toast.success("Submitted answer.");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormControl>
								<div className="relative">
									<Input
										{...field}
										className="peer h-auto rounded-b-none rounded-t border-b-2 border-b-secondary/50 bg-card read-only:bg-muted/50 focus:border-b-primary focus-visible:ring-transparent md:px-4 md:py-2 md:ps-11 md:text-lg"
										placeholder="Type your answer"
										onChange={(event) => {
											typeAnswer(props.socket, {
												quizQuestionId: props.question.question.quizQuestionId,
												content: event.target.value,
												userId: props.player.user.userId,
												quizId: params.quizId
											});
											return field.onChange(event);
										}}
										value={currentAnswer?.content ?? field.value}
										disabled={isTimerDone || currentAnswer !== undefined}
									/>
									<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
										<IconPen className="size-6" />
									</div>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit" disabled={currentAnswer !== undefined}>
						<CheckIcon size={16} />
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
