import { createFileRoute } from "@tanstack/react-router";
import { JoinLobbyForm } from "./-components/join-lobby-form";
import { Quizzes } from "./-components/quizzes";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div>
      <h1>Quiz Bee</h1>

      {/* NOTE: This is useless now (｡•́︿•̀｡). Not enough time to implement */}
      {/* <JoinLobbyForm /> */}

      {/* NOTE: Join quiz directly instead */}
      <Quizzes />
    </div>
  );
}
