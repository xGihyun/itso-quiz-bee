import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { WrittenAnswerInput, WrittenAnswerSchema } from "./schema";
import useWebSocket, { ReadyState } from "react-use-websocket";
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
  QuizChangeQuestionRequest,
  QuizSubmitAnswerRequest,
  WebSocketEvent,
  WebSocketRequest,
  WebSocketResponse,
} from "@/lib/websocket/types";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { AnswerProps } from "..";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";

export function WrittenAnswerForm(props: AnswerProps): JSX.Element {
  const form = useForm<WrittenAnswerInput>({
    resolver: zodResolver(WrittenAnswerSchema),
    defaultValues: {
      content: props.answer?.content || "",
      quiz_question_id: props.question.quiz_question_id,
    },
  });

  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketResponse = await JSON.parse(event.data);

      switch (result.event) {
        case WebSocketEvent.QuizChangeQuestion:
          const data = result.data as QuizChangeQuestionRequest;
          form.reset({
            content: "",
            quiz_question_id: data.quiz_question_id,
          });
          break;

        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    share: true,
    ...WEBSOCKET_OPTIONS,
  });

  async function onSubmit(value: WrittenAnswerInput): Promise<void> {
    console.log(value);
    if (props.hasSubmitted) {
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

    socket.sendJsonMessage(message);
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
                  className="
                  md:text-xl md:px-4 md:py-2 h-auto read-only:bg-muted/50
                  bg-muted focus-visible:ring-transparent
                  border-b-2 border-b-secondary/50
                  rounded-t rounded-b-none focus:border-b-primary
                  "
                  placeholder="Type your answer"
                  onChange={(event) => {
                    typeAnswer(socket, {
                      quiz_question_id: props.question.quiz_question_id,
                      content: event.target.value,
                    });
                    return field.onChange(event);
                  }}
                  readOnly={props.hasSubmitted || props.isFrozen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={props.hasSubmitted || props.isFrozen}
          >
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
