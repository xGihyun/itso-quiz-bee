import { createFileRoute } from "@tanstack/react-router";
import { Quizzes } from "./-components/quizzes";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="w-full grid place-items-center">
      <div className="container py-10">
        <h1 className="text-4xl py-2 mb-4">Quiz List</h1>
        <Quizzes />
      </div>
    </div>
  );
}
