import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/answer/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>This is where the players will choose answers</div>;
}
