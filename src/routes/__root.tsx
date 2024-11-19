import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
import "../index.css";
import { Navbar } from "./-components/navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster closeButton />
        {location.pathname.startsWith("/quizzes") &&
        location.pathname.endsWith("answer") ? null : (
          <Navbar />
        )}

        <main className="h-[100svh]">
          <div className="h-full pt-16">
            <Outlet />
          </div>
        </main>

        <TanStackRouterDevtools position="bottom-right" />
      </QueryClientProvider>
    </>
  );
}
