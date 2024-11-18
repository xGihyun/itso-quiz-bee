import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  result?: QuizResult;
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
    <Card>
      <CardHeader>
        <CardTitle className="flex-row flex items-center gap-2">
          <UserIcon />
          {props.player.first_name} {props.player.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h2 className="font-medium flex items-center gap-2 mb-2">
            <PenLineIcon size={16} />
            Current Answer
          </h2>
          <p
            className={`bg-secondary p-3 rounded-md ${answerContent ? "text-foreground" : "text-muted-foreground"}`}
          >
            {answerContent || "No answer."}
          </p>
        </div>

        <div>
          <h2 className="font-medium flex items-center gap-2 mb-2">
            <TrophyIcon size={16} />
            Score
          </h2>
          <p className="bg-secondary p-3 rounded-md">
            {props.result?.score || 0}
          </p>
        </div>

        <div>
          <h2 className="font-medium flex items-center gap-2 mb-2">
            <CheckCircleIcon className="h-5 w-5" />
            Submitted Answers
          </h2>

          {props.result && props.result.answers.length > 0 ? (
            <ScrollArea className="h-48 w-full rounded-md border p-4">
              {props.result.answers.map((answer, i) => (
                <div
                  key={answer.player_answer_id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Badge variant="secondary" className="mt-1">
                    #{i + 1}
                  </Badge>

                  <div className="flex gap-2">
                    <p>{answer.content}</p>
                    <Badge
                      variant={answer.is_correct ? "success" : "destructive"}
                      className="mt-1"
                    >
                      {answer.is_correct ? (
                        <CheckCircleIcon size={16} strokeWidth={2} />
                      ) : (
                        <XCircleIcon size={16} strokeWidth={2} />
                      )}
                    </Badge>
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
