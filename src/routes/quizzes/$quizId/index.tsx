import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>Specific Quiz!</div>;
}
