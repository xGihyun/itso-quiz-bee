import { JSX } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { Quiz, QuizStatus } from "@/lib/quiz/types";
import { updateQuizStatus } from "../-functions/websocket";
import { IconAuto, IconTimer } from "@/lib/icons";

type Props = {
	quiz: Quiz;
};

// TODO: Make timer work

export function Controls(props: Props): JSX.Element {
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true
	});

	return (
		<div className="fixed bottom-0 left-0 grid h-16 w-full grid-cols-3 items-center border-t bg-card px-10">
			<div className="content-center">
				<p className="font-metropolis-bold">{props.quiz.name}</p>
			</div>

			<div className="mx-auto">
				<Select
					value={props.quiz.status}
					onValueChange={(v) =>
						updateQuizStatus(socket, {
							quiz_id: props.quiz.quiz_id,
							status: v as QuizStatus
						})

                        // TODO: Try to implement this
						//if (status === QuizStatus.Started) {
						//	const firstQuestion = quiz.questions.find(
						//		(q) => q.order_number === 1,
						//	);
						//
						//	if (!firstQuestion) {
						//		return;
						//	}
						//
						//	updatePlayersQuestion(socket, {
						//		...firstQuestion,
						//		quiz_id: quiz.quiz_id,
						//	});
						//}
					}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						{Object.keys(QuizStatus).map((key) => (
							// @ts-expect-error `QuizStatus[key]` is valid
							<SelectItem value={QuizStatus[key]} key={key}>
								{key}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex w-full items-center justify-end gap-2">
				<IconAuto className="size-6" />
				<IconTimer className="size-6" />
			</div>
		</div>
	);
}
