import { useEffect, useRef } from "react";
import { getResults, useAdminView } from "..";
import gsap from "gsap";
import { Badge, CheckCircleIcon, Trophy, XCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
import useWebSocket from "react-use-websocket";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import {
  QuizSubmitAnswerRequest,
  WebSocketEvent,
  WebSocketResponse,
} from "@/lib/websocket/types";
import { WrittenAnswerInput } from "../../answer/-components/schema";
import { QuizWrittenAnswerRequest } from "@/lib/quiz/types";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";

const PlayerFullscreen = () => {
  const params = useParams({ from: "/quizzes/$quizId/view/" });
  const queryClient = useQueryClient();
  const adminQuizView = useAdminView();
  const mainComponentLayout = useRef<HTMLDivElement>(null);

  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketResponse = await JSON.parse(event.data);

      switch (result.event) {
        case WebSocketEvent.QuizTypeAnswer:
          {
            const data = result.data as WrittenAnswerInput;

            adminQuizView.setCurrentPlayerAnswer?.((prev) => ({
              data: data,
              event: WebSocketEvent.QuizTypeAnswer,
            }));
          }
          break;

        case WebSocketEvent.QuizSubmitAnswer:
          {
            console.log(result);

            //const data =
            //  result.data as QuizSubmitAnswerRequest<QuizWrittenAnswerRequest>;

            const quizResultQuery = await queryClient.fetchQuery({
              queryKey: ["quiz", "results", params.quizId],
              queryFn: () => getResults(params.quizId),
            });

            const playerResult = quizResultQuery.data.find(
              (result) => result.user_id === adminQuizView.player?.user_id,
            );

            console.log("RESULTS:", quizResultQuery);
            console.log("CURRENT:", playerResult);

            // @ts-ignore
            adminQuizView?.setCurrentPlayerResult?.((oldResult) => ({
              ...playerResult,
            }));
          }
          break;
        default:
      }
    },
    share: true,
    ...WEBSOCKET_OPTIONS,
  });

  useEffect(() => {
    gsap.set(mainComponentLayout.current, {
      opacity: 0,
      scale: 0,
      display: "none",
    });
  }, []);

  useEffect(() => {
    if (adminQuizView.isAdminViewing) {
      gsap.fromTo(
        mainComponentLayout.current,
        {
          opacity: 0,
          scale: 0,
          display: "inline",
        },
        {
          opacity: 1,
          scale: 1,
        },
      );
    } else {
      gsap.fromTo(
        mainComponentLayout.current,
        {
          opacity: 1,
          scale: 1,
        },
        {
          opacity: 0,
          scale: 0,
          display: "none",
        },
      );
    }
  }, [adminQuizView.isAdminViewing]);

  return (
    <div
      ref={mainComponentLayout}
      className="h-full w-full absolute bg-background z-[999] grid place-items-center"
    >
      <div className="container py-20 w-full h-full flex flex-col justify-between items-center">
        <div className="flex flex-row w-full">
          <div className="flex-1 flex flex-row items-center justify-start">
            <span className="text-white font-bold text-3xl">
              {adminQuizView.player?.last_name},{" "}
              {adminQuizView.player?.first_name}{" "}
              {adminQuizView.player?.middle_name}
            </span>
          </div>

          <div className="flex-1 flex flex-row items-center justify-end gap-4">
            <Trophy />
            <span className="text-white font-bold text-3xl text-center">
              {adminQuizView.currentPlayerResult?.score}
            </span>
          </div>
        </div>

        <div className="w-1/2">
          <Input
            className="ps-9 h-20 md:text-2xl read-only:bg-muted/50 bg-muted border-b-2 border-b-secondary/50 rounded-t rounded-b-none"
            placeholder="No answer."
            // @ts-ignore
            value={adminQuizView.currentPlayerAnswer?.data.content}
            readOnly
          />
        </div>

        <div className="w-1/2">
          {adminQuizView.currentPlayerResult &&
          adminQuizView.currentPlayerResult.answers.length > 0 ? (
            <ScrollArea className="h-80 w-full rounded-md border p-4 bg-muted/50">
              {adminQuizView.currentPlayerResult?.answers.map((answer, i) => (
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
          ) : null}
        </div>

        <div className="flex flex-row gap-4">
          <Button>Previous</Button>
          <Button>Next</Button>
          <Button onClick={() => adminQuizView.setPlayerViewing?.()}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export { PlayerFullscreen };

