import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "./-components/form";
import { JSX } from "react";

export const Route = createFileRoute("/(auth)/login/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session !== null) {
			throw redirect({ to: "/" });
		}
	}
});

function RouteComponent(): JSX.Element {
	return (
		<div className="h-svh content-center">
			<LoginForm />
		</div>
	);
}
