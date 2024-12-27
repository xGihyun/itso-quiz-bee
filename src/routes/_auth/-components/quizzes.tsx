import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseStatus } from "@/lib/api/types";
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
import { ErrorAlert } from "@/components/error-alert";
import { getQuizzes } from "@/lib/quiz/requests";
import { useAuth } from "@/lib/auth/context";

export function Quizzes(): JSX.Element {
	const auth = useAuth();
	const socket = useWebSocket(WEBSOCKET_URL, {
		...WEBSOCKET_OPTIONS
	});
	const navigate = useNavigate({ from: "/" });
	const query = useQuery({
		queryKey: ["quizzes"],
		queryFn: getQuizzes
	});

	const quizzesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (query.isSuccess && quizzesRef.current) {
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
			}
		}, 1000);
	}, [query.isSuccess]);

	if (query.isPending) {
		return (
			<div className="grid grid-cols-4">
				<Skeleton className="h-full w-full" />
				<Skeleton className="h-full w-full" />
				<Skeleton className="h-full w-full" />
				<Skeleton className="h-full w-full" />
			</div>
		);
	}

	if (query.isError) {
		return <ErrorAlert message={query.error.message} />;
	}

	if (query.data.status !== ApiResponseStatus.Success) {
		return <ErrorAlert message={query.data.message} />;
	}

	const quizzes = query.data.data;

	return (
		<div
			className="grid grid-cols-4 gap-4 py-4"
			ref={quizzesRef} // Attach ref to the container
		>
			{quizzes.map((quiz) => (
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
