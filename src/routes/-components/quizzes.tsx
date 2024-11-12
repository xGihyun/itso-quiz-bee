import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Divide } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiResponse } from "@/lib/types/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { QuizBasicInfo } from "../quizzes/-types";

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
        <Link
          href={`/quizzes/${quiz.quiz_id}`}
          className="hover:scale-95 transition-transform duration-300"
          key={quiz.quiz_id}
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
        </Link>
      ))}
    </div>
  );
}
