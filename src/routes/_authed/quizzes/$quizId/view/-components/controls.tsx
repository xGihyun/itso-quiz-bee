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
import { Quiz, QuizStatus } from "@/lib/quiz";
import { showLeaderboard, updateQuizStatus } from "../-functions/websocket";
import { Toggle } from "@/components/ui/toggle";
import { useAuth } from "@/auth";

type Props = {
	quiz: Quiz;
};

export function Controls(props: Props): JSX.Element {
	const auth = useAuth();
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS,
		share: true,
		queryParams: {
			token: auth.sessionToken
		}
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
							quizId: props.quiz.quizId,
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

			<div>
				<Toggle onPressedChange={(v) => showLeaderboard(socket, v)}>
					Leaderbaord
				</Toggle>
			</div>
		</div>
	);
}
