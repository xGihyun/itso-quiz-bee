import { createFileRoute, redirect } from "@tanstack/react-router";
import { EditQuizForm } from "./-components/edit-quiz-form";
import { NewQuizInput } from "./-components/schema";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseStatus } from "@/lib/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/server";
import { UserRole } from "@/lib/user/types";

export const Route = createFileRoute("/quizzes/$quizId/edit/")({
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
  const params = Route.useParams();
  const query = useQuery({
    queryKey: ["quiz"],
    queryFn: () => getQuiz(params.quizId),
  });

  if (query.isPending) {
    return <Skeleton className="w-20 h-20" />;
  }

  if (query.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{query.data?.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <EditQuizForm quiz={query.data.data} />
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

  console.log(result)

  return result;
}
