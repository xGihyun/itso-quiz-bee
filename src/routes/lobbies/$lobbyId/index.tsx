import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lobbies/$lobbyId/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  return <div>This is lobby!</div>;
}
