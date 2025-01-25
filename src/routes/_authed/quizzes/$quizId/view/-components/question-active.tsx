import { IconClick, IconQuestionAnswer } from "@/lib/icons";
import { QuizQuestion } from "@/lib/quiz/types";
import { JSX } from "react";

type Props = {
	question: QuizQuestion;
};

export function QuestionActive(props: Props): JSX.Element {
	return (
		<div className="h-full content-center space-y-2 rounded border bg-card p-6 overflow-auto">
			<p className="text-center font-metropolis-bold text-2xl">
				{props.question.content}
			</p>

			<div className="flex items-center justify-center gap-1">
				<IconQuestionAnswer className="size-6 text-primary" />
				{/*
				<IconClick className="size-6 text-primary" />
				<p>Click to reveal answer.</p>
                */}
				<p>{props.question.answers[0].content}</p>
			</div>
		</div>
	);
}
