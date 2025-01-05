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

type Props = {
	quiz: Quiz;
};

export function Controls(props: Props): JSX.Element {
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true
	});

	return (
		<div className="fixed bottom-0 left-0 grid w-full grid-cols-3 border-t bg-card px-10 py-4">
			<div className="content-center">
				<p>{props.quiz.name}</p>
			</div>

			<div className="mx-auto">
				<Select
					value={props.quiz.status}
					onValueChange={(v) =>
						updateQuizStatus(socket, {
							quiz_id: props.quiz.quiz_id,
							status: v as QuizStatus
						})
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

			<div></div>
		</div>
	);
}
