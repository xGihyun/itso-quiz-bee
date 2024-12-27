import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
        console.log("VALIDATED 1")
		const session = await context.auth.validateSession();
		if (session === null) {
			throw redirect({ to: "/login" });
		}

        return {
            user: session
        }
	}
});

function RouteComponent() {
	return (
		<div>
			<Outlet />
		</div>
	);
}
