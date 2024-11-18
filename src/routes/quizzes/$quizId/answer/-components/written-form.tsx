import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { WrittenAnswerInput, WrittenAnswerSchema } from "./schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { WebSocketHook } from "react-use-websocket/dist/lib/types";
import {
  QuizSubmitAnswerRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/websocket/types";
import { GetWrittenAnswerResponse, QuizQuestion } from "@/lib/quiz/types";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  socket: WebSocketHook;
  question: QuizQuestion;
  quizId: string;
  answer: GetWrittenAnswerResponse | null;
};

export function WrittenAnswerForm(props: Props): JSX.Element {
  const form = useForm<WrittenAnswerInput>({
    resolver: zodResolver(WrittenAnswerSchema),
    defaultValues: {
      content: props.answer?.content || "",
      quiz_question_id: props.question.quiz_question_id,
    },
  });
  const [hasSubmitted, setHasSubmitted] = useState(props.answer !== null);

  async function onSubmit(value: WrittenAnswerInput): Promise<void> {
    if (hasSubmitted) {
      toast.info("You have already submitted an answer.");
      return;
    }

    const data: QuizSubmitAnswerRequest<WrittenAnswerInput> = {
      quiz_question_id: props.question.quiz_question_id,
      quiz_id: props.quizId,
      variant: props.question.variant,
      answer: value,
    };

    const message: WebSocketRequest<
      QuizSubmitAnswerRequest<WrittenAnswerInput>
    > = {
      event: WebSocketEvent.QuizSubmitAnswer,
      data: data,
    };

    props.socket.sendJsonMessage(message);

    setHasSubmitted(true);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  className="md:text-xl md:px-4 md:py-2 h-auto read-only:bg-muted/50"
                  placeholder="Type your answer"
                  onChange={(event) => {
                    typeAnswer(props.socket, {
                      quiz_question_id: props.question.quiz_question_id,
                      content: event.target.value,
                    });
                    return field.onChange(event);
                  }}
                  readOnly={hasSubmitted}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={hasSubmitted}>
            <CheckIcon size={16} />
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

type QuizTypeAnswerRequest = WrittenAnswerInput;

function typeAnswer(socket: WebSocketHook, data: QuizTypeAnswerRequest): void {
  const message: WebSocketRequest<QuizTypeAnswerRequest> = {
    event: WebSocketEvent.QuizTypeAnswer,
    data: {
      content: data.content,
      quiz_question_id: data.quiz_question_id,
    },
  };

  socket.sendJsonMessage(message);
}
