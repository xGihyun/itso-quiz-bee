import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {

  // TODO: Use form to dynamically add questions and stuff
  return (
    <div>
      <div>
        <h1>Untitled Quiz</h1>

        <p>Insert description</p>
      </div>

      <Button>Add Question</Button>
    </div>
  );
}
