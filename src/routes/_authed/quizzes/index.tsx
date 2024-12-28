import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/quizzes/")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	}
});
