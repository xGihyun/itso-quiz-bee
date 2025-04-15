import { createFileRoute } from "@tanstack/react-router";
import { Quizzes } from "./-components/quizzes";
import { JSX } from "react";
import { ErrorAlert } from "@/components/error-alert";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { quizzesQueryOptions } from "@/lib/quiz";

export const Route = createFileRoute("/_authed/")({
	component: HomeComponent,
	loader: async ({ context }) => {
		const quizzesQuery =
			await context.queryClient.ensureQueryData(quizzesQueryOptions);

		return {
			quizzes: quizzesQuery.data
		};
	},
	errorComponent: ({ error }) => {
		return <ErrorAlert message={error.message} />;
	},
	pendingComponent: () => <div>Loading...</div>
});

function HomeComponent(): JSX.Element {
	const loaderData = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const createQuiz = async (): Promise<void> => {
		const quizId = uuidv4();

		await navigate({ to: "/quizzes/$quizId/edit", params: { quizId: quizId } });
	};

	return (
		<div className="grid w-full place-items-center">
			<div className="container py-10">
				<h1 className="mb-4 py-2 text-4xl">Quiz List</h1>
				<Quizzes quizzes={loaderData.quizzes} />
				<Button onClick={createQuiz}>Create</Button>
			</div>
		</div>
	);
}
