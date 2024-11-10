import { createFileRoute } from "@tanstack/react-router";
import { EditQuizForm } from "./-components/edit-quiz-form";
import { NewQuizInput } from "./-components/schema";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/types/api";

export const Route = createFileRoute("/quizzes/$quizId/edit/")({
  component: RouteComponent,
});

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const query = useQuery({
    queryKey: ["quiz"],
    queryFn: () => getQuiz(params.quizId),
  });

  let toastId: string | number;

  if (query.isPending) {
    toastId = toast.loading("Getting quiz...");
  } else if (query.error) {
    toastId = toast.error(query.data?.message);
  } else {
    toastId = toast.success(query.data?.message);
  }

  // TODO: Use form to dynamically add questions and stuff
  return (
    <div className="max-w-lg mx-auto">
      <EditQuizForm quiz={query.data?.data} />
    </div>
  );
}

async function getQuiz(quizId: string): Promise<ApiResponse<NewQuizInput>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${quizId}`,
    {
      method: "GET",
    },
  );

  const result: ApiResponse<NewQuizInput> = await response.json();

  return result;
}
