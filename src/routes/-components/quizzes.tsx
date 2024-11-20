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
import { User, UserRole } from "@/lib/user/types";
import { QuizBasicInfo, QuizStatus } from "@/lib/quiz/types";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { userInfo } from "os";

async function getQuizzes(): Promise<ApiResponse<QuizBasicInfo[]>> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
    {
      method: "GET",
    }
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

  const quizzesRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<ApiResponse<User>>();
  const [hasLoaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const userGot = await getCurrentUser();
      setUser(userGot);
      setLoaded(true)
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (query.isSuccess && quizzesRef.current) {
        gsap.fromTo(
          quizzesRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }
    }, 1000)

    console.log(query.isSuccess);
  }, [query.isSuccess]);

  if (query.isPending) {
    return (
      <div className="grid grid-cols-4 ">
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
    <div
      className="grid grid-cols-4 gap-4 py-4"
      ref={quizzesRef} // Attach ref to the container
    >
      {query.data.data.map((quiz) => (
        <button
          key={quiz.quiz_id}
          onClick={async () => {
            console.log("called")
            const user = await getCurrentUser();
            console.log(user);


            if (user.data.role === UserRole.Player) {
              const result = await joinQuiz({ quiz_id: quiz.quiz_id });


              if (result.status !== ApiResponseStatus.Success) {
                console.error("Failed to join quiz:", result);
              }

              toast.success(result.message);
            }

            if (user.data.role === UserRole.Admin) {
              console.log("helo")
              return await navigate({
                to: "/quizzes/$quizId/view",
                params: { quizId: quiz.quiz_id },
              });
            }

            await navigate({
              to: "/quizzes/$quizId",
              params: { quizId: quiz.quiz_id },
            });
          }}
          className="contents"
        >

          <Card
            className={`relative hover:scale-95 transition-transform cursor-pointer`}
          >
            <div className="absolute px-2 bg-green-400 rounded-xl right-4 -bottom-3">
              <span className="text-sm text-black text-center font-bold">
                {quiz.status}
              </span>
            </div>
            <CardHeader>
              <CardTitle>{quiz.name}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
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
    }
  );

  const result: ApiResponse = await response.json();

  return result;
}
