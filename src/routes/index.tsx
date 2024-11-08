import { createFileRoute } from "@tanstack/react-router";
import { JoinLobbyForm } from "./-components/join-lobby-form";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <h1>Quiz Bee</h1>

      <JoinLobbyForm />
    </div>
  );
}
