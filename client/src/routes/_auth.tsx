import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session !== null) {
			throw redirect({ to: "/" });
		}
	}
});

function RouteComponent() {
	return (
		<div className="h-svh content-center">
			<Outlet />
		</div>
	);
}
