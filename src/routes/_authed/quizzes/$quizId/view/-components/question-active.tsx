import { IconClick } from "@/lib/icons";
import { QuizQuestion } from "@/lib/quiz/types";
import { JSX } from "react";

type Props = {
	question: QuizQuestion;
};

// TODO: Click to reveal answer
export function QuestionActive(props: Props): JSX.Element {
	return (
		<div className="h-60 content-center space-y-2 rounded border bg-card p-6">
			<p className="text-center font-metropolis-bold text-2xl">
				{props.question.content}
			</p>

			<div className="flex items-center justify-center gap-1">
				<IconClick className="size-6 text-primary" />
				<p>Click to reveal answer.</p>
			</div>
		</div>
	);
}
