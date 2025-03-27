import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { JSX, useEffect, useRef } from "react";
import gsap from "gsap";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { useAuth } from "@/auth";
import { QuizBasicInfo, QuizStatus } from "@/lib/quiz/types";
import { UserRole } from "@/lib/user";

type Props = {
	quizzes: QuizBasicInfo[];
};

export function Quizzes(props: Props): JSX.Element {
	const auth = useAuth();
	const navigate = useNavigate({ from: "/" });
	const quizzesRef = useRef<HTMLDivElement | null>(null);

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

	async function joinQuiz(quiz: QuizBasicInfo) {
		if (auth.user === null) {
			return;
		}

		if (auth.user.role === UserRole.Admin) {
			await navigate({
				to: "/quizzes/$quizId/view",
				params: { quizId: quiz.quizId }
			});
			return;
		}

		if (quiz.status === QuizStatus.Started) {
			await navigate({
				to: "/quizzes/$quizId/answer",
				params: { quizId: quiz.quizId }
			});
			return;
		}

		await navigate({
			to: "/quizzes/$quizId",
			params: { quizId: quiz.quizId }
		});
	}

	return (
		<div className="grid grid-cols-4 gap-4 py-4" ref={quizzesRef}>
			{props.quizzes.map((quiz) => (
				<button
					key={quiz.quizId}
					onClick={async () => await joinQuiz(quiz)}
					className="contents"
				>
					<Card
						className={`relative cursor-pointer overflow-hidden transition-transform`}
					>
						<div className="absolute left-0 top-0 rounded-br-lg bg-green-400 px-2">
							<span className="text-xs text-background">{quiz.status}</span>
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
	userId: string;
	quizId: string;
};

function joinQuiz(socket: WebSocketHook, data: JoinQuizRequest): void {
	const message: WebSocketRequest<JoinQuizRequest> = {
		event: WebSocketEvent.PlayerJoin,
		data: data
	};

	socket.sendJsonMessage(message);
}
