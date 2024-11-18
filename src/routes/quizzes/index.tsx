import { Button } from "@/components/ui/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { v4 as uuidv4 } from "uuid";

export const Route = createFileRoute("/quizzes/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const navigate = useNavigate({ from: "/quizzes" });

  const createQuiz = async (): Promise<void> => {
    const quizId = uuidv4();

    await navigate({ to: "/quizzes/$quizId/create", params: { quizId: quizId } });
  };

  return (
    <div>
      <Button onClick={createQuiz}>Create</Button>
    </div>
  );
}
