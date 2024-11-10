import { Toaster } from "@/components/ui/sonner";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
import "../index.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster closeButton />

        <main className="h-[100svh]">
          <Outlet />
        </main>

        <TanStackRouterDevtools position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}
