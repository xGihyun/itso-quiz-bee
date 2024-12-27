import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "./-components/form";

export const Route = createFileRoute("/login/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
