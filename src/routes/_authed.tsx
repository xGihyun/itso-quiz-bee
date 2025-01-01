import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = await context.auth.validateSession();
		if (session === null) {
			throw redirect({ to: "/login" });
		}

		return {
			session: session
		};
	}
});

function RouteComponent() {
	return (
		<div className="h-full pt-16">
			<Outlet />
		</div>
	);
}
