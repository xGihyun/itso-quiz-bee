import { QuizQuestion } from "@/lib/quiz/types";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { JSX } from "react";
import useWebSocket from "react-use-websocket";
import { updatePlayersQuestion } from "../-functions/websocket";
import { useParams } from "@tanstack/react-router";

type Props = {
	question: QuizQuestion;
	isActive: boolean;
};

export function QuestionListItem(props: Props): JSX.Element {
	const params = useParams({ from: "/_authed/quizzes/$quizId/view/" });
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true
	});

	return (
		<button
			className={`block w-full rounded border px-3 py-2 text-start ${props.isActive ? "bg-primary text-primary-foreground" : "bg-card"}`}
			onClick={() =>
				updatePlayersQuestion(socket, {
					...props.question,
					quiz_id: params.quizId
				})
			}
		>
			<p className="line-clamp-1">{props.question.content}</p>
			<div className={ `space-x-1 ${props.isActive ? "text-primary-foreground/80" : "text-muted-foreground"}` }>
				<span className="text-sm">{props.question.points}</span>
				<span className="text-xs">pts.</span>
			</div>
		</button>
	);
}
