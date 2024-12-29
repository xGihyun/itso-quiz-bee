import { createFileRoute } from "@tanstack/react-router";
import { EditQuizForm } from "./-components/edit-quiz-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { JSX } from "react";
import { ErrorAlert } from "@/components/error-alert";
import { quizQueryOptions } from "@/lib/quiz/query";

export const Route = createFileRoute("/_authed/quizzes/$quizId/edit/")({
	component: RouteComponent,
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>,
	loader: ({ context, params }) => {
		return context.queryClient.ensureQueryData(quizQueryOptions(params.quizId));
	}
});

function RouteComponent(): JSX.Element {
	const params = Route.useParams();
	const query = useSuspenseQuery(quizQueryOptions(params.quizId));

	return (
		<div className="mx-auto max-w-screen-sm">
			<EditQuizForm quiz={query.data.data} />
		</div>
	);
}
