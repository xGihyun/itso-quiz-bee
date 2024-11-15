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
import { QuizQuestion } from "@/lib/quiz/types";

type Props = {
  socket: WebSocketHook;
  question: QuizQuestion;
  quizId: string;
};

export function WrittenAnswerForm(props: Props): JSX.Element {
  const form = useForm<WrittenAnswerInput>({
    resolver: zodResolver(WrittenAnswerSchema),
    defaultValues: {
      content: "",
      quiz_question_id: props.question.quiz_question_id,
      user_id: "",
    },
  });

  async function onSubmit(value: WrittenAnswerInput): Promise<void> {
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

    console.log(message);

    props.socket.sendJsonMessage(message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter answer here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
