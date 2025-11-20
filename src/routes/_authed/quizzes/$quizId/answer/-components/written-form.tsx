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
import { JSX, useState, useEffect } from "react";
import { submitAnswer, typeAnswer } from "../-functions/websocket";
import { useParams } from "@tanstack/react-router";
import { IconPen } from "@/lib/icons";
import { Player } from "@/lib/quiz/player";
import { QuizCurrentQuestion } from "@/lib/quiz/question";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { toast } from "sonner";

type Props = {
	player: Player;
	question: QuizCurrentQuestion;
	socket: WebSocketHook; // Add socket as a prop
	isTimerDone: boolean;
	isInteractionLocked: boolean;
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
	const [currentAnswer, setCurrentAnswer] = useState<
		WrittenAnswerInput | undefined
	>(
		props.player.result.answers.find(
			(answer) =>
				answer.quizQuestionId === props.question.question.quizQuestionId
		)
	);

	// Update the form when the question changes
	useEffect(() => {
		const newCurrentAnswer = props.player.result.answers.find(
			(answer) =>
				answer.quizQuestionId === props.question.question.quizQuestionId
		);

		console.log("Current", currentAnswer);
		console.log("New current", newCurrentAnswer);
		console.log("Is timer done", props.isTimerDone);
		console.log("Is interaction locked", props.isInteractionLocked);

		// if (!newCurrentAnswer) return;

		setCurrentAnswer(newCurrentAnswer);

		form.reset({
			content: newCurrentAnswer?.content ?? "",
			quizQuestionId: props.question.question.quizQuestionId
		});
	}, [props.question.question.quizQuestionId, props.player.result.answers]);

	useEffect(() => {
		console.log("is timer done debug:", props.isTimerDone);
	}, [props.isTimerDone]);

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
											if (!props.isInteractionLocked && !props.isTimerDone) {
												typeAnswer(props.socket, {
													quizQuestionId:
														props.question.question.quizQuestionId,
													content: event.target.value,
													userId: props.player.user.userId,
													quizId: params.quizId
												});
											}
											return field.onChange(event);
										}}
										value={currentAnswer?.content ?? field.value}
										disabled={
											props.isTimerDone ||
											props.isInteractionLocked ||
											currentAnswer !== undefined
										}
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
					<Button
						type="submit"
						disabled={
							currentAnswer !== undefined ||
							props.isInteractionLocked ||
							props.isTimerDone
						}
					>
						<CheckIcon size={16} />
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
