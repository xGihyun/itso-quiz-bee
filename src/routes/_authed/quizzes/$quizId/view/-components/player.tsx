import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlayerCurrentAnswer,
  QuizQuestion,
  QuizResult,
  QuizUser,
} from "@/lib/quiz/types";
import { WebSocketEvent } from "@/lib/websocket/types";
import {
  CheckCircleIcon,
  PenLineIcon,
  TrophyIcon,
  UserIcon,
  XCircleIcon,
} from "lucide-react";

type PlayerProps = {
  player: QuizUser;
  answer?: PlayerCurrentAnswer;
  question: QuizQuestion | null;
  maxScore: number;
  result?: QuizResult;
  onPlayerCardClicked?: () => void;
};

export function Player(props: PlayerProps): JSX.Element {
  let answerContent: string | undefined;

  if (props.question) {
    if (props.answer?.event === WebSocketEvent.QuizSelectAnswer) {
      const answerId = props.answer.data.quiz_answer_id;
      answerContent =
        props.question.answers.find((value) => value.quiz_answer_id == answerId)
          ?.content || "No answer.";
    } else {
      answerContent = props.answer?.data.content;
    }
  }

  return (
    <Card className="hover:opacity-90 hover:scale-95 cursor-pointer transition-all" onClick={() => props.onPlayerCardClicked?.()}>
      <CardHeader>
        <CardTitle className="flex-row flex items-center gap-2">
          <UserIcon size={24} />
          <p className="font-['metropolis-medium']">
            {props.player.first_name} {props.player.last_name}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 items-center">
          <TrophyIcon size={16} />
          {props.result?.score || 0} / {props.maxScore}
        </div>

        <div className="relative">
          <Input
            className="ps-9 read-only:bg-muted/50 bg-muted border-b-2 border-b-secondary/50 rounded-t rounded-b-none"
            value={answerContent}
            placeholder="No answer."
            readOnly
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
            <PenLineIcon size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>

        <div>
          <h2 className="font-medium flex items-center gap-2 mb-2">
            <CheckCircleIcon size={16} />
            Submitted Answers
          </h2>

          {props.result && props.result.answers.length > 0 ? (
            <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
              {props.result.answers.map((answer, i) => (
                <div
                  key={answer.player_answer_id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Badge className="mt-1">#{i + 1}</Badge>

                  <div className="flex gap-2 items-center">
                    <p>{answer.content}</p>

                    {answer.is_correct ? (
                      <CheckCircleIcon
                        size={16}
                        strokeWidth={2}
                        className="text-green-500"
                      />
                    ) : (
                      <XCircleIcon
                        size={16}
                        strokeWidth={2}
                        className="text-destructive"
                      />
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">No submitted answers yet.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
