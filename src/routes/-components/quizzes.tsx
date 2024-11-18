import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiResponse, ApiResponseStatus } from "@/lib/api/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/user/requests";
import { UserRole } from "@/lib/user/types";
import { QuizBasicInfo } from "@/lib/quiz/types";

async function getQuizzes(): Promise<ApiResponse<QuizBasicInfo[]>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
    {
      method: "GET",
    },
  );
  const result: ApiResponse<QuizBasicInfo[]> = await response.json();

  return result;
}

export function Quizzes(): JSX.Element {
  const navigate = useNavigate({ from: "/" });
  const query = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  if (query.isPending) {
    return (
      <div className="grid grid-cols-4">
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
      </div>
    );
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
    <div className="grid grid-cols-4 gap-2">
      {query.data.data.map((quiz) => (
        <button
          key={quiz.quiz_id}
          onClick={async () => {
            const user = await getCurrentUser();
            console.log(user);

            if (user.data.role === UserRole.Player) {
              const result = await joinQuiz({ quiz_id: quiz.quiz_id });

              console.log(result)

              if (result.status !== ApiResponseStatus.Success) {
                console.error("Failed to join quiz:", result);
                //return;
              }

              toast.success(result.message);
            }

            await navigate({
              to: "/quizzes/$quizId",
              params: { quizId: quiz.quiz_id },
            });
          }}
          className="contents"
        >
          <Card>
            <CardHeader>
              <CardTitle>{quiz.name}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Quiz Data</p>
            </CardContent>
          </Card>
        </button>
      ))}
    </div>
  );
}

type JoinQuizRequest = {
  quiz_id: string;
};

async function joinQuiz(data: JoinQuizRequest): Promise<ApiResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/${data.quiz_id}/join`,
    {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    },
  );

  const result: ApiResponse = await response.json();

  return result;
}
