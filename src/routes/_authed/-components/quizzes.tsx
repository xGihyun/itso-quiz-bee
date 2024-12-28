import useWebSocket from "react-use-websocket";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { JSX, useEffect, useRef } from "react";
import gsap from "gsap";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { useAuth } from "@/lib/auth/context";
import { QuizBasicInfo } from "@/lib/quiz/types";

type Props = {
	quizzes: QuizBasicInfo[];
};

export function Quizzes(props: Props): JSX.Element {
	const auth = useAuth();
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS
	});
	const navigate = useNavigate({ from: "/" });

	const quizzesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (!quizzesRef.current) {
				return;
			}

			gsap.fromTo(
				quizzesRef.current.children,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out"
				}
			);
		}, 1000);
	}, []);

	return (
		<div
			className="grid grid-cols-4 gap-4 py-4"
			ref={quizzesRef} // Attach ref to the container
		>
			{props.quizzes.map((quiz) => (
				<button
					key={quiz.quiz_id}
					onClick={async () => {
						if (auth.user === null) {
							return;
						}

						joinQuiz(socket, {
							quiz_id: quiz.quiz_id,
							user_id: auth.user.user_id
						});

						await navigate({
							to: "/quizzes/$quizId/view",
							params: { quizId: quiz.quiz_id }
						});
					}}
					className="contents"
				>
					<Card
						className={`relative cursor-pointer transition-transform hover:scale-95`}
					>
						<div className="absolute -bottom-3 right-4 rounded-xl bg-green-400 px-2">
							<span className="text-center text-sm font-bold text-black">
								{quiz.status}
							</span>
						</div>
						<CardHeader>
							<CardTitle>{quiz.name}</CardTitle>
							<CardDescription>{quiz.description}</CardDescription>
						</CardHeader>
					</Card>
				</button>
			))}
		</div>
	);
}

type JoinQuizRequest = {
	user_id: string;
	quiz_id: string;
};

function joinQuiz(socket: WebSocketHook, data: JoinQuizRequest): void {
	const message: WebSocketRequest<JoinQuizRequest> = {
		event: WebSocketEvent.PlayerJoin,
		data: data
	};

	socket.sendJsonMessage(message);
}
