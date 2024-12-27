import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/user/types";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { JSX } from "react";
import { v4 as uuidv4 } from "uuid";

export const Route = createFileRoute("/_auth/quizzes/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session === null) {
			throw redirect({ to: "/login" });
		}

		if (session.role !== UserRole.Admin) {
			console.error("Permission denied.");
			throw redirect({ to: "/" });
		}
	}
});

function RouteComponent(): JSX.Element {
	const navigate = useNavigate({ from: "/quizzes" });

	const createQuiz = async (): Promise<void> => {
		const quizId = uuidv4();

		await navigate({ to: "/quizzes/$quizId/edit", params: { quizId: quizId } });
	};

	return (
		<div>
			<Button onClick={createQuiz}>Create</Button>
		</div>
	);
}
