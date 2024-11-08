import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>Quiz!</div>;
}
