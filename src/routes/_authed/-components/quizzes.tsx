import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { JSX } from "react";
import { useAuth } from "@/auth";
import { QuizBasicInfo } from "@/lib/quiz";
import { UserRole } from "@/lib/user";

type Props = {
	quizzes: QuizBasicInfo[];
};

export function Quizzes(props: Props): JSX.Element {
	const auth = useAuth();
	const navigate = useNavigate({ from: "/" });

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

		await navigate({
			to: "/quizzes/$quizId/answer",
			params: { quizId: quiz.quizId }
		});
	}

	return (
		<div className="grid grid-cols-4 gap-4 py-4">
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
