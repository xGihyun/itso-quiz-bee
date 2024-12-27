import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewQuizInput, NewQuizSchema } from "./schema";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useParams } from "@tanstack/react-router";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/api/types";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Quiz, QuizQuestionVariant, QuizStatus } from "@/lib/quiz/types";
import { createDefaultAnswer, createDefaultQuestion } from "../-constants";
import { withMask } from "use-mask-input";

type Props = {
  quiz?: Quiz;
};

export function EditQuizForm(props: Props): JSX.Element {
  const params = useParams({ from: "/quizzes/$quizId/edit/" });

  const form = useForm<NewQuizInput>({
    resolver: zodResolver(NewQuizSchema),
    defaultValues: props.quiz || {
      questions: [createDefaultQuestion()],
      description: "",
      name: "Untitled Quiz",
      status: QuizStatus.Closed,
      quiz_id: params.quizId,
      lobby_id: null,
    },
  });

  const formQuestions = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(value: NewQuizInput): Promise<void> {
    let toastId = toast.loading("Creating quiz...");

    console.log(value);

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/quizzes`,
      {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      toast.error(result.message || "Server error.", { id: toastId });
      return;
    }

    toast.success(result.message, { id: toastId });
  }

  function resetAnswer(value: string, index: number): void {
    const newAnswer = createDefaultAnswer();

    if (!newAnswer) {
      console.error("Invalid question variant:", value);
      return;
    }

    form.setValue(`questions.${index}.answers`, [newAnswer]);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Insert Title"
                      className="md:text-2xl h-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Insert description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {formQuestions.fields.map((field, i) => {
          return (
            <Card key={field.id}>
              <CardHeader className="grid grid-cols-3 space-y-0 gap-2">
                <FormField
                  control={form.control}
                  name={`questions.${i}.content`}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-2">
                      <FormControl>
                        <AutosizeTextarea
                          placeholder="Insert question"
                          minHeight={36}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${i}.variant`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          resetAnswer(value, i);

                          return field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Variant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={QuizQuestionVariant.MultipleChoice}
                          >
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value={QuizQuestionVariant.Boolean}>
                            Boolean
                          </SelectItem>
                          <SelectItem value={QuizQuestionVariant.Written}>
                            Written
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${i}.points`}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-1">
                      <FormControl>
                        <Input placeholder="Points" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`questions.${i}.duration`}
                  render={({ field }) => (
                    <FormItem className="w-full col-span-1">
                      <FormControl>
                        <Input
                          {...field}
                          //placeholder="00:00:00"
                          type="text"
                          //ref={withMask("99:99:99", {
                          //  placeholder: "-",
                          //  showMaskOnHover: false,
                          //})}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardHeader>

              <CardContent>
                <AnswersField form={form} index={i} />
              </CardContent>
            </Card>
          );
        })}

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => formQuestions.append(createDefaultQuestion())}
            variant="secondary"
          >
            Add Question
          </Button>
          <Button type="submit">Create Quiz</Button>
        </div>
      </form>
    </Form>
  );
}

type AnswersFieldProps = {
  index: number;
  form: UseFormReturn<NewQuizInput>;
};

function AnswersField(props: AnswersFieldProps): JSX.Element {
  const formAnswers = useFieldArray({
    control: props.form.control,
    name: `questions.${props.index}.answers`,
  });

  const questionVariant = props.form.getValues(
    `questions.${props.index}.variant`,
  );

  function addAnswer(): void {
    //const newAnswer = DEFAULT_ANSWER.get(questionVariant);
    //
    //if (!newAnswer) {
    //  console.error("Invalid question variant:", questionVariant);
    //  return;
    //}

    formAnswers.append({
      content: `Option ${formAnswers.fields.length + 1}`,
      is_correct: true,
      quiz_answer_id: uuidv4(),
    });
  }

  function handleRadioSelect(index: number): void {
    formAnswers.fields.forEach((_, i) => {
      props.form.setValue(
        `questions.${props.index}.answers.${i}.is_correct`,
        true,
      );
    });

    props.form.setValue(
      `questions.${props.index}.answers.${index}.is_correct`,
      true,
    );
  }

  return (
    <div className="space-y-2">
      <RadioGroup>
        <div className="flex items-center space-x-2"></div>
        {formAnswers.fields.map((field, i) => {
          return (
            <div key={field.id} className="flex items-center space-x-2">
              {/*
              <RadioGroupItem
                value={i.toString()}
                onClick={() => handleRadioSelect(i)}
                checked={field.is_correct}
              />
                 */}
              <FormField
                control={props.form.control}
                name={`questions.${props.index}.answers.${i}.content`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input placeholder="Insert answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
      </RadioGroup>

      <Button type="button" onClick={addAnswer} variant="secondary">
        Add Answer
      </Button>
    </div>
  );
}
