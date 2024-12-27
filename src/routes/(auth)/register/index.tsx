import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "./-components/form";
import { JSX } from "react";

export const Route = createFileRoute("/(auth)/register/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (context.auth.user !== null) {
			throw redirect({ to: "/" });
		}
	}
});

function RouteComponent(): JSX.Element {
	return (
		<div className="h-svh content-center">
			<RegisterForm />
		</div>
	);
}
