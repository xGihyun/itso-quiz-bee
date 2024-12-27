import { createFileRoute, redirect } from "@tanstack/react-router";
import { Quizzes } from "./-components/quizzes";
import { JSX } from "react";

export const Route = createFileRoute("/_auth/")({
	component: HomeComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session === null) {
			throw redirect({ to: "/login" });
		}
	}
});

function HomeComponent(): JSX.Element {
	return (
		<div className="grid w-full place-items-center">
			<div className="container py-10">
				<h1 className="mb-4 py-2 text-4xl">Quiz List</h1>
				<Quizzes />
			</div>
		</div>
	);
}
