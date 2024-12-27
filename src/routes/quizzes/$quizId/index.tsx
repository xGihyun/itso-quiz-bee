import {
  QuizUpdateStatusRequest,
  WebSocketEvent,
  WebSocketRequest,
} from "@/lib/websocket/types";
import { createFileRoute } from "@tanstack/react-router";
import useWebSocket from "react-use-websocket";
import { toast } from "sonner";
import { WEBSOCKET_OPTIONS, WEBSOCKET_URL } from "@/lib/websocket/constants";
import { QuizStatus } from "@/lib/quiz/types";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PuffLoader } from "react-spinners";

export const Route = createFileRoute("/quizzes/$quizId/")({
  component: RouteComponent,
});

const umakFacts = [
  "The University of Makati (UMak) is a public university located in Taguig City, Metro Manila, Philippines.",
  "UMak was founded in 1972 as the Makati Polytechnic Community College.",
  "UMak is the only public university in Metro Manila.",
  "UMak offers a wide range of undergraduate and graduate programs.",
  "The College of Computing and Information Sciences (CCIS) is one of the colleges at UMak.",
  "This system was custom-developed for this competition using Astro, React, Tailwind, and Golang.",
];

// NOTE: This is like the waiting room before the quiz starts

function RouteComponent(): JSX.Element {
  const navigate = Route.useNavigate();
  const socket = useWebSocket(WEBSOCKET_URL, {
    onMessage: async (event) => {
      const result: WebSocketRequest = await JSON.parse(event.data);

      switch (result.event) {
        case WebSocketEvent.QuizUpdateStatus:
          const data = result.data as QuizUpdateStatusRequest;

          console.log("Quiz status updated:", data.status);

          if (data.status === QuizStatus.Started) {
            await gsap.to(contentContainerRef.current, {
              scale: 0,
              ease: "expo.in",
              duration: 0.5,
            });

            await navigate({ to: "answer" });
          }
          break;
        default:
          console.warn("Unknown event type:", result.event);
      }
    },
    ...WEBSOCKET_OPTIONS,
  });

  const [funFact, setFunFact] = useState<string>("");
  const funFactRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let funfactInterval: any;
    gsap.fromTo(
      titleRef.current,
      {
        top: "-50px",
        opacity: 0,
      },
      {
        top: "0px",
        opacity: 1,
      },
    );
    gsap.fromTo(
      funFactRef.current,
      {
        top: "50px",
        opacity: 0,
      },
      {
        top: "0px",
        opacity: 1,
      },
    );

    let time: number = Math.ceil(Math.random() * 5) + 5;
    setFunFact(umakFacts[Math.ceil(Math.random() * umakFacts.length - 1)]);

    funfactInterval = setInterval(async () => {
      await gsap.to(funFactRef.current, {
        right: "50px",
        opacity: 0,
      });

      setFunFact(umakFacts[Math.ceil(Math.random() * umakFacts.length - 1)]);
      time = Math.ceil(Math.random() * 5) + 5;

      await gsap
        .fromTo(
          funFactRef.current,
          {
            right: "-50px",
            opacity: 0,
          },
          {
            right: "0",
            opacity: 1,
          },
        )
        .play();
    }, time * 1000);

    return () => clearInterval(funfactInterval);
  }, []);

  return (
    <div className="w-full h-full grid place-items-center">
      <div
        ref={contentContainerRef}
        className="flex flex-col items-center *:text-center gap-4"
      >
        <PuffLoader color="#95C2FE" />
        <span ref={titleRef} className="font-bold text-4xl relative">
          Wait until the competition starts...
        </span>

        <span className="text-sm italic relative " ref={funFactRef}>
          {funFact}
        </span>
      </div>
    </div>
  );
}
