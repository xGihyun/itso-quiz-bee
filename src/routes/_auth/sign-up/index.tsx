import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "./-components/form";
import { JSX } from "react";

export const Route = createFileRoute("/_auth/register/")({
	component: RouteComponent
});

function RouteComponent(): JSX.Element {
	return <RegisterForm />;
}
