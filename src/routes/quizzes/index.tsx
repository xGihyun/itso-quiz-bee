import { Button } from "@/components/ui/button";
import { ApiResponseStatus } from "@/lib/api/types";
import { getCurrentUser } from "@/lib/server";
import { UserRole } from "@/lib/user/types";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { v4 as uuidv4 } from "uuid";

export const Route = createFileRoute("/quizzes/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const result = await getCurrentUser();

    if (result.status !== ApiResponseStatus.Success) {
      console.error(result.message);
      throw redirect({ to: "/" });
    }

    if (result.data.role !== UserRole.Admin) {
      console.error("Permission denied.");
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent(): JSX.Element {
  const navigate = useNavigate({ from: "/quizzes" });

  const createQuiz = async (): Promise<void> => {
    const quizId = uuidv4();

    await navigate({ to: "/quizzes/$quizId/edit", params: { quizId: quizId } });
  };

  return (
    <div>
      <Button onClick={createQuiz}>Create</Button>
    </div>
  );
}
