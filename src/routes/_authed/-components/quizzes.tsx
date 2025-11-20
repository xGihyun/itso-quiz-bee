import { Quiz, QuizBasicInfo, QuizStatus } from "@/lib/quiz";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { JSX } from "react";
import {
	PencilIcon,
	PlayIcon,
	ClockIcon,
	TrophyIcon,
	PlusIcon
} from "lucide-react";

type Props = {
	quizzes: QuizBasicInfo[];
	isAdmin: boolean;
};

export function Quizzes(props: Props): JSX.Element {
	const navigate = useNavigate();

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "started":
				return "default";
			case "closed":
				return "secondary";
			case "ended":
				return "outline";
			default:
				return "secondary";
		}
	};

	const totalPoints = (quiz: Quiz) => {
		return quiz.questions.reduce((sum, q) => sum + q.points, 0);
	};

	return (
		<section className="ga grid grid-cols-4 gap-2">
			{props.quizzes.map((quiz) => (
				<Card
					key={quiz.quizId}
					className="group flex flex-col transition-all hover:shadow-lg"
				>
					<CardHeader>
						<div className="flex items-start justify-between gap-2">
							<CardTitle className="line-clamp-2 text-xl">
								{quiz.name}
							</CardTitle>
							<Badge variant={getStatusVariant(quiz.status)}>
								{quiz.status}
							</Badge>
						</div>
						{quiz.description && (
							<CardDescription className="line-clamp-2">
								{quiz.description}
							</CardDescription>
						)}
					</CardHeader>

					<CardFooter className="flex gap-2">
						{props.isAdmin ? (
							<>
								<Button
									variant="outline"
									size="sm"
									className="flex-1"
									onClick={() =>
										navigate({
											to: "/quizzes/$quizId/edit",
											params: { quizId: quiz.quizId }
										})
									}
								>
									<PencilIcon className="mr-2 h-4 w-4" />
									Edit
								</Button>
								<Button
									size="sm"
									className="flex-1"
									onClick={() =>
										navigate({
											to: "/quizzes/$quizId/view",
											params: { quizId: quiz.quizId }
										})
									}
								>
									<PlayIcon className="mr-2 h-4 w-4" />
									View
								</Button>
							</>
						) : (
							<Button
								size="sm"
								className="w-full"
								onClick={() => {
									// if (quiz.status === QuizStatus.Open) {
									// 	navigate({
									// 		to: "/quizzes/$quizId",
									// 		params: { quizId: quiz.quizId }
									// 	});
									// 	return;
									// }

									navigate({
										to: "/quizzes/$quizId/answer",
										params: { quizId: quiz.quizId }
									});
								}}
								disabled={
									!(
										quiz.status === QuizStatus.Started ||
										quiz.status === QuizStatus.Open
									)
								}
							>
								<PlayIcon className="mr-2 h-4 w-4" />
								{quiz.status === "started" || quiz.status === "open"
									? "Join Quiz"
									: "Not Available"}
							</Button>
						)}
					</CardFooter>
				</Card>
			))}
		</section>
	);
}
