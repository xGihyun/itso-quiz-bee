import { Quiz, QuizQuestion, QuizStatus } from "@/lib/quiz";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { JSX } from "react";
import useWebSocket from "react-use-websocket";
import { updatePlayersQuestion } from "../-functions/websocket";
import { useParams } from "@tanstack/react-router";
import { useAuth } from "@/auth";

type Props = {
	quiz: Quiz;
	question: QuizQuestion;
	isActive: boolean;
	onQuestionClick: (question: QuizQuestion) => void; // Add callback prop
};

export function QuestionListItem(props: Props): JSX.Element {
	return (
		<button
			className={`flex w-full gap-4 rounded border px-4 py-3 text-start ${props.isActive ? "bg-primary text-primary-foreground" : "bg-card"}`}
			onClick={() => {
				props.onQuestionClick(props.question);
			}}
		>
			<div className="content-center font-metropolis-bold text-lg">
				{props.question.orderNumber}
			</div>
			<div>
				<p className="line-clamp-1">{props.question.content}</p>
				<div
					className={`space-x-1 ${props.isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
				>
					<span className="text-sm">{props.question.points}</span>
					<span className="text-xs">pts.</span>
				</div>
			</div>
		</button>
	);
}
