import { createFileRoute } from "@tanstack/react-router";
import { WebSocketEvent, WebSocketRequest } from "@/lib/websocket/types";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import {
  GetWrittenAnswerResponse,
  QuizQuestion,
  QuizQuestionVariant,
} from "@/lib/quiz/types";
import {
  freezeQuiz,
  getCurrentAnswer,
  getCurrentQuestion,
  getQuizFreezeState,
} from "@/lib/quiz/requests";
import { MultipleChoiceForm } from "./-components/multiple-choice-form";
import { WrittenAnswerForm } from "./-components/written-form";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import { useEffect, useRef, useState } from "react";
import { hasSubscribers } from "diagnostics_channel";
import gsap from "gsap";

export const Route = createFileRoute("/quizzes/$quizId/answer/")({
  component: RouteComponent,
});

// NOTE:
// This is where the players would answer the quiz
// Redirect here once admin starts the quiz

// TODO: (IMPORTANT!!!)
// Prevent answer resubmission

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const [freezed, setFreezed] = useState(false);
  const currentQuestionQuery = useQuery({
    queryKey: ["current-question"],
    queryFn: () => getCurrentQuestion(params.quizId),
  });
  const currentAnswerQuery = useQuery({
    queryKey: ["current-answer"],
    queryFn: () => getCurrentAnswer(params.quizId),
  });

  const quizFreezeState = useQuery({
    queryKey: ["frozen"],
    queryFn: () => getQuizFreezeState(params.quizId),
  });

  useEffect(() => {
    if (quizFreezeState.isFetched) {
      setFreezed(quizFreezeState.data?.data?.freezed!);
    }
  }, [quizFreezeState.isFetched, quizFreezeState.isRefetching]);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketRequest<QuizQuestion> = await JSON.parse(
        event.data
      );

      switch (result.event) {
        case WebSocketEvent.QuizChangeQuestion:
          await currentQuestionQuery.refetch();
          setHasSubmitted(false);
          await quizFreezeState.refetch();

          toast.info("Next question!");
          break;
        case WebSocketEvent.QuizSubmitAnswer:
          setHasSubmitted(true);
          toast.info("Submitted answer!");
          break;
        case WebSocketEvent.QuizTypeAnswer:
          break;
        case WebSocketEvent.QuizFreezeSubmit:
          await quizFreezeState.refetch();
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    ...WEBSOCKET_OPTIONS,
  });

  if (currentQuestionQuery.isPending || currentAnswerQuery.isPending) {
    return <Skeleton className="w-20 h-20" />;
  }

  if (currentQuestionQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {currentQuestionQuery.data?.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (currentAnswerQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{currentAnswerQuery.data?.message}</AlertDescription>
      </Alert>
    );
  }

  const question = currentQuestionQuery.data.data;
  const answer = currentAnswerQuery.data.data;

  if (question === null) {
    return <div>No questions available.</div>;
  }

  return (
    <Answer
      socket={socket}
      question={question}
      quizId={params.quizId}
      answer={answer}
      hasSubmitted={hasSubmitted}
      isFrozen={freezed}
    />
  );
}

export type AnswerProps = {
  socket: WebSocketHook;
  question: QuizQuestion;
  quizId: string;
  answer: GetWrittenAnswerResponse | null;
  hasSubmitted: boolean;
  isFrozen: boolean;
};

function Answer(props: AnswerProps): JSX.Element {
  const mainElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      mainElement.current,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
      }
    );
  }, []);

  return (
    <div ref={mainElement} className="flex flex-col h-full">
      <div className="px-20 py-10 h-full flex items-center">
        <p className="mb-5 font-['metropolis-bold'] text-3xl max-w-5xl mx-auto text-center">
          {props.question.content}
        </p>
      </div>

      <div className="bg-card px-20 py-10 h-full flex w-full mx-auto">
        <div className="max-w-5xl mx-auto w-full">
          {props.question.variant === QuizQuestionVariant.Written ? (
            <WrittenAnswerForm {...props} />
          ) : (
            <MultipleChoiceForm
              socket={props.socket}
              question={props.question}
              quizId={props.quizId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
