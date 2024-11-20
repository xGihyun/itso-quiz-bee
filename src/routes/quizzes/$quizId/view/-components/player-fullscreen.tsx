import { useEffect, useRef } from "react";
import { useAdminView } from ".."
import gsap from "gsap";
import { Badge, CheckCircleIcon, Trophy, XCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";

const PlayerFullscreen = () => {
    const adminQuizView = useAdminView();

    const mainComponentLayout = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.set(mainComponentLayout.current, {
            opacity: 0,
            scale: 0,
            display: "none"
        })

    }, [])



    useEffect(() => {
        if (adminQuizView.adminViewing) {
            gsap.fromTo(mainComponentLayout.current, {
                opacity: 0,
                scale: 0,
                display: "inline"
            }, {
                opacity: 1,
                scale: 1
            })
        } else {
            gsap.fromTo(mainComponentLayout.current, {
                opacity: 1,
                scale: 1
            }, {
                opacity: 0,
                scale: 0,
                display: "none"
            })
        }

    }, [adminQuizView.adminViewing])


    return <div ref={mainComponentLayout} className="h-full w-full absolute bg-background z-[999] grid place-items-center">
        <div className="container py-20 w-full h-full flex flex-col justify-between items-center">
            <div className="flex flex-row w-full">
                <div className="flex-1 flex flex-row items-center justify-start">
                    <span className="text-white font-bold text-3xl">{adminQuizView.players?.last_name}, {adminQuizView.players?.first_name} {adminQuizView.players?.middle_name}</span>
                </div>

                <div className="flex-1 flex flex-row items-center justify-end gap-4">
                    <Trophy />
                    <span className="text-white font-bold text-3xl text-center">{adminQuizView.playerCurrentResult?.score}</span>
                </div>
            </div>

            <div className="w-1/2">
                <Input
                    className="ps-9 h-20 md:text-2xl read-only:bg-muted/50 bg-muted border-b-2 border-b-secondary/50 rounded-t rounded-b-none"
                    placeholder="No answer."
                    // @ts-ignore
                    value={adminQuizView.playerCurrentAnswer?.data.content}
                    readOnly
                />
            </div>

            <div className="w-1/2">
                {
                    adminQuizView.playerCurrentResult && adminQuizView.playerCurrentResult.answers.length > 0 ? (
                        <ScrollArea className="h-80 w-full rounded-md border p-4 bg-muted/50">
                    {
                        adminQuizView.playerCurrentResult?.answers.map((answer, i) => <div
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
                      </div>)
                    }
                        </ScrollArea>
                    ) : null
                }
            </div>

            <div className="flex flex-row gap-4">
                <Button>Previous</Button>
                <Button>Next</Button>
                <Button onClick={() => adminQuizView.setPlayerViewing?.()}>Close</Button>
            </div>
        </div>
    </div>
}

export default PlayerFullscreen