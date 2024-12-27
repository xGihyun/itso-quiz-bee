import { Toaster } from "@/components/ui/sonner";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "./-components/navbar";
import "../index.css";
import { AuthContextValue, useAuth } from "@/lib/auth/context";

type RouterContext = {
	auth: AuthContextValue;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent
});

function RootComponent() {
	const auth = useAuth();

	return (
		<>
			<Toaster closeButton richColors />

			{auth.user !== null ? <Navbar /> : null}

			<main className={auth.user !== null ? "py-16" : ""}>
				<Outlet />
			</main>

			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}
