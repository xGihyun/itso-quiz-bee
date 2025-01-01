import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { WrittenAnswerInput, WrittenAnswerSchema } from "./schema";
import useWebSocket from "react-use-websocket";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WebSocketEvent, WebSocketResponse } from "@/lib/websocket/types";
import { CheckIcon } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizQuestion } from "@/lib/quiz/types";
import { JSX } from "react";
import { User } from "@/lib/user/types";
import { submitAnswer, typeAnswer } from "../-functions/websocket";
import { useParams } from "@tanstack/react-router";
import { IconPen } from "@/lib/icons";

type Props = {
	user: User;
	question: QuizQuestion;
};

export function WrittenAnswerForm(props: Props): JSX.Element {
	const params = useParams({ from: "/_authed/quizzes/$quizId/answer/" });
	const form = useForm<WrittenAnswerInput>({
		resolver: zodResolver(WrittenAnswerSchema),
		defaultValues: {
			content: "",
			quiz_question_id: props.question.quiz_question_id
		}
	});

	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		onMessage: async (event) => {
			const result: WebSocketResponse = await JSON.parse(event.data);

			switch (result.event) {
				case WebSocketEvent.QuizUpdateQuestion:
					const data = result.data as QuizQuestion;
					form.reset({
						content: "",
						quiz_question_id: data.quiz_question_id
					});
					break;

				default:
					console.warn("Unknown event type:", result.event);
			}
		}
	});

	async function onSubmit(value: WrittenAnswerInput): Promise<void> {
		submitAnswer(socket, {
			...value,
			user_id: props.user.user_id,
			quiz_id: params.quizId
		});
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
										className="h-auto rounded-b-none rounded-t border-b-2 border-b-secondary/50 bg-card read-only:bg-muted/50 focus:border-b-primary focus-visible:ring-transparent md:px-4 md:py-2 md:ps-11 md:text-lg peer"
										placeholder="Type your answer"
										onChange={(event) => {
											typeAnswer(socket, {
												quiz_question_id: props.question.quiz_question_id,
												content: event.target.value,
												user_id: props.user.user_id,
												quiz_id: params.quizId
											});
											return field.onChange(event);
										}}
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
					<Button type="submit">
						<CheckIcon size={16} />
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
