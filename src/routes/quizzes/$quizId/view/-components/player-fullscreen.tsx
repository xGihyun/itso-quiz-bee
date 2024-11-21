import { useEffect, useRef, useState } from "react";
import { useAdminView } from "..";
import gsap from "gsap";
import { Badge, CheckCircleIcon, Trophy, XCircleIcon } from "lucide-react";
import { Input, InputProps } from "@/components/ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";

const PlayerFullscreen = () => {
  const adminQuizView = useAdminView();

  const mainComponentLayout = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [key, setKey] = useState("");
  const handleKeyDown = (event: any) => {
    setKey(event.key);
  };
  const [answerText, setAnswerText] = useState<string>();

  useEffect(() => {
    // Update the state whenever `adminQuizView.playerCurrentAnswer?.data.content` changes
    // @ts-ignore
    setAnswerText(adminQuizView.playerCurrentAnswer?.data.content || "");
    console.log("open")
  }, [
    // @ts-ignore
    adminQuizView.playerCurrentAnswer,
    adminQuizView.currentPlayerViewing,
  ]);

  useEffect(() => {
    if (adminQuizView.adminViewing) {
      if (key == "ArrowRight") {
        adminQuizView.setCurrentPlayerViewing?.(
          (adminQuizView.currentPlayerViewing ?? 0) + 1
        );
        setKey("");
      } else if (key == "ArrowLeft") {
        adminQuizView.setCurrentPlayerViewing?.(
          (adminQuizView.currentPlayerViewing ?? 0) - 1
        );
        setKey("");
      } else if (key == "Escape" || key == "Backspace") {
        adminQuizView.setPlayerViewing?.();
        setKey("");
      }
    }
    // @ts-ignore
    setAnswerText(adminQuizView.playerCurrentAnswer?.data.content || "");

}, [key, adminQuizView.adminViewing]);

  useEffect(() => {
    gsap.set(mainComponentLayout.current, {
      opacity: 0,
      scale: 0,
      display: "none",
    });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [adminQuizView.players]);

  useEffect(() => {
    if (adminQuizView.adminViewing) {
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
        }
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
        }
      );
    }
  }, [adminQuizView.adminViewing]);

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={mainComponentLayout}
      className="h-full w-full fixed bg-background z-[999] grid place-items-center"
    >
      <div className="container py-20 w-full h-full flex flex-col justify-between items-center md:w-3/4">
        <div className="flex flex-row w-full">
          <div className="flex-1 flex flex-row items-center justify-start">
            <span className="text-white font-bold text-3xl">
              {adminQuizView.players?.last_name},{" "}
              {adminQuizView.players?.first_name}{" "}
              {adminQuizView.players?.middle_name}
            </span>
          </div>

          <div className="flex-1 flex flex-row items-center justify-end gap-4">
            <Trophy />
            <span className="text-white font-bold text-3xl text-center">
              {adminQuizView.playerCurrentResult?.score ?? 0}
            </span>
          </div>
        </div>

        <div className="w-1/2 md:w-3/4">
          <Input
            ref={inputRef}
            className="ps-9 h-20 md:text-2xl read-only:bg-muted/50 bg-muted border-b-2 border-b-secondary/50 rounded-t rounded-b-none"
            placeholder="No answer."
            value={answerText} // Use `answerText` from state
            readOnly
          />
        </div>

        <div className="w-1/2"></div>
      </div>
    </div>
  );
};

export default PlayerFullscreen;
